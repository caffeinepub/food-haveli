import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type Cuisine = {
    #indian;
    #chinese;
    #italian;
    #mexican;
    #american;
    #other : Text;
  };

  type Restaurant = {
    id : Nat;
    name : Text;
    description : Text;
    cuisineType : Cuisine;
    owner : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    available : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #ready;
    #delivered;
    #cancelled;
  };

  type Order = {
    id : Nat;
    customerId : Principal;
    restaurantId : Nat;
    items : [(Nat, Nat)]; // (menuItemId, quantity)
    totalPrice : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type Message = {
    id : Nat;
    sessionId : Text;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    isRestaurantOwner : Bool;
  };

  // Constants
  let cuisineMap = Map.empty<Text, Cuisine>();
  cuisineMap.add("indian", #indian);
  cuisineMap.add("chinese", #chinese);
  cuisineMap.add("italian", #italian);
  cuisineMap.add("mexican", #mexican);
  cuisineMap.add("american", #american);

  // State
  let restaurants = Map.empty<Nat, Restaurant>();
  let restaurantMenuItems : Map.Map<Nat, Map.Map<Nat, MenuItem>> = Map.empty();
  let orders = Map.empty<Nat, Order>();
  let messages = Map.empty<Text, List.List<Message>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextId = 1;

  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper Functions
  func getNextId() : Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  func getExistingRestaurant(restaurantId : Nat) : Restaurant {
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant does not exist") };
      case (?restaurant) { restaurant };
    };
  };

  func getExistingMenuItem(restaurantId : Nat, menuItemId : Nat) : MenuItem {
    switch (restaurantMenuItems.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant does not exist or has no menu items") };
      case (?items) {
        switch (items.get(menuItemId)) {
          case (null) { Runtime.trap("Menu item does not exist") };
          case (?menuItem) { menuItem };
        };
      };
    };
  };

  func isRestaurantOwner(caller : Principal, restaurantId : Nat) : Bool {
    let restaurant = getExistingRestaurant(restaurantId);
    caller == restaurant.owner;
  };

  func isRegisteredRestaurantOwner(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.isRestaurantOwner };
    };
  };

  // Cuisine type comparison
  func cuisineToText(c : Cuisine) : Text {
    switch (c) {
      case (#indian) { "indian" };
      case (#chinese) { "chinese" };
      case (#italian) { "italian" };
      case (#mexican) { "mexican" };
      case (#american) { "american" };
      case (#other(txt)) { txt };
    };
  };

  // Modules for comparison functions
  module Restaurant {
    public func compareByName(rest1 : Restaurant, rest2 : Restaurant) : Order.Order {
      Text.compare(rest1.name, rest2.name);
    };

    public func compareByCuisine(rest1 : Restaurant, rest2 : Restaurant) : Order.Order {
      switch (Text.compare(cuisineToText(rest1.cuisineType), cuisineToText(rest2.cuisineType))) {
        case (#equal) { compareByName(rest1, rest2) };
        case (order) { order };
      };
    };
  };

  module MenuItem {
    public func compareByCategory(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.category, item2.category);
    };

    public func compareByPrice(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Nat.compare(item1.price, item2.price);
    };
  };

  // Restaurant Management
  public shared ({ caller }) func createRestaurant(name : Text, description : Text, cuisineType : Text) : async Restaurant {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create restaurants");
    };

    if (not isRegisteredRestaurantOwner(caller)) {
      Runtime.trap("Unauthorized: Only registered restaurant owners can create restaurants");
    };

    let id = getNextId();
    let newRestaurant : Restaurant = {
      id;
      name;
      description;
      cuisineType = switch (cuisineMap.get(cuisineType)) {
        case (null) { #other(cuisineType) };
        case (?cuisine) { cuisine };
      };
      owner = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    restaurants.add(id, newRestaurant);
    restaurantMenuItems.add(id, Map.empty<Nat, MenuItem>());
    newRestaurant;
  };

  public shared ({ caller }) func updateRestaurant(restaurantId : Nat, name : Text, description : Text, cuisineType : Text) : async Restaurant {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update restaurants");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can update this restaurant");
    };

    let existing = getExistingRestaurant(restaurantId);
    let updated : Restaurant = {
      id = restaurantId;
      name;
      description;
      cuisineType = switch (cuisineMap.get(cuisineType)) {
        case (null) { #other(cuisineType) };
        case (?cuisine) { cuisine };
      };
      owner = existing.owner;
      createdAt = existing.createdAt;
      updatedAt = Time.now();
    };

    restaurants.add(restaurantId, updated);
    updated;
  };

  public query ({ caller }) func getRestaurant(restaurantId : Nat) : async Restaurant {
    // Public access - anyone can view restaurant details
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant does not exist") };
      case (?restaurant) { restaurant };
    };
  };

  public query ({ caller }) func getAllRestaurants() : async [Restaurant] {
    // Public access - anyone can browse restaurants
    restaurants.values().toArray();
  };

  public query ({ caller }) func getRestaurantsByCuisine(cuisineType : Cuisine) : async [Restaurant] {
    // Public access - anyone can browse restaurants by cuisine
    restaurants.values().toArray().filter(
      func(rest) { rest.cuisineType == cuisineType }
    );
  };

  public query ({ caller }) func getRestaurantsByCuisineText(cuisineType : Text) : async [Restaurant] {
    // Public access - anyone can browse restaurants by cuisine
    let cuisine = switch (cuisineMap.get(cuisineType)) {
      case (null) { #other(cuisineType) };
      case (?cuisine) { cuisine };
    };
    restaurants.values().toArray().filter(
      func(rest) { rest.cuisineType == cuisine }
    );
  };

  // Menu Management
  public shared ({ caller }) func addMenuItem(restaurantId : Nat, name : Text, description : Text, price : Nat, category : Text, imageUrl : Text) : async MenuItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add menu items");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can add menu items to this restaurant");
    };

    let id = getNextId();
    let newMenuItem : MenuItem = {
      id;
      name;
      description;
      price;
      category;
      imageUrl;
      available = true;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let items = switch (restaurantMenuItems.get(restaurantId)) {
      case (null) {
        let newItems = Map.empty<Nat, MenuItem>();
        restaurantMenuItems.add(restaurantId, newItems);
        newItems;
      };
      case (?items) { items };
    };

    items.add(id, newMenuItem);
    newMenuItem;
  };

  public shared ({ caller }) func updateMenuItem(restaurantId : Nat, menuItemId : Nat, name : Text, description : Text, price : Nat, category : Text, imageUrl : Text, available : Bool) : async MenuItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update menu items");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can update menu items for this restaurant");
    };

    let items = switch (restaurantMenuItems.get(restaurantId)) {
      case (null) { Map.empty<Nat, MenuItem>() };
      case (?items) { items };
    };

    switch (items.get(menuItemId)) {
      case (null) { Runtime.trap("Menu item does not exist") };
      case (?existing) {
        let updated = {
          id = menuItemId;
          name;
          description;
          price;
          category;
          imageUrl;
          available;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        items.add(menuItemId, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(restaurantId : Nat, menuItemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete menu items");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can delete menu items from this restaurant");
    };

    let items = switch (restaurantMenuItems.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant has no menu items to delete") };
      case (?items) {
        items.remove(menuItemId);
      };
    };
  };

  public query ({ caller }) func getMenuItems(restaurantId : Nat) : async [MenuItem] {
    // Public access - anyone can view menu items
    switch (restaurantMenuItems.get(restaurantId)) {
      case (null) { [] };
      case (?items) {
        items.values().toArray().filter(func(item) { item.available });
      };
    };
  };

  public query ({ caller }) func getMenuItemsByCategory(restaurantId : Nat, category : Text) : async [MenuItem] {
    // Public access - anyone can view menu items by category
    switch (restaurantMenuItems.get(restaurantId)) {
      case (null) { [] };
      case (?items) {
        items.values().toArray().filter(
          func(item) { item.available and item.category == category }
        );
      };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder(restaurantId : Nat, items : [(Nat, Nat)]) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    // Validate restaurant existence
    if (restaurants.get(restaurantId) == null) {
      Runtime.trap("Restaurant does not exist");
    };

    // Validate items and calculate total price
    var totalPrice = 0;
    for ((menuItemId, quantity) in items.values()) {
      if (quantity < 1) {
        Runtime.trap("Invalid quantity for menu item " # menuItemId.toText());
      };

      let menuItem = getExistingMenuItem(restaurantId, menuItemId);
      if (not menuItem.available) {
        Runtime.trap("Menu item " # menuItem.name # " is not available");
      };

      totalPrice += menuItem.price * quantity;
    };

    let id = getNextId();
    let newOrder : Order = {
      id;
      customerId = caller;
      restaurantId;
      items;
      totalPrice;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    orders.add(id, newOrder);
    newOrder;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update order status");
    };

    // Only restaurant owner can update order status
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?existing) {
        if (not isRestaurantOwner(caller, existing.restaurantId)) {
          Runtime.trap("Unauthorized: Only restaurant owner can update order status");
        };
        let updated = {
          id = existing.id;
          customerId = existing.customerId;
          restaurantId = existing.restaurantId;
          items = existing.items;
          totalPrice = existing.totalPrice;
          status;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        orders.add(orderId, updated);
        updated;
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (caller != order.customerId and not isRestaurantOwner(caller, order.restaurantId)) {
          Runtime.trap("Unauthorized: Only order customer or restaurant owner can view this order");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrdersByRestaurant(restaurantId : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can view orders for this restaurant");
    };
    orders.values().toArray().filter(
      func(order) { order.restaurantId == restaurantId }
    );
  };

  public query ({ caller }) func getCustomerOrders(customerId : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    if (caller != customerId) {
      Runtime.trap("Unauthorized: Only customer can view their own orders");
    };
    orders.values().toArray().filter(
      func(order) { order.customerId == customerId }
    );
  };

  // Analytics (simplified)
  public query ({ caller }) func getOrderStats(restaurantId : Nat) : async {
    totalOrders : Nat;
    totalRevenue : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    if (not isRestaurantOwner(caller, restaurantId)) {
      Runtime.trap("Unauthorized: Only restaurant owner can view analytics");
    };

    var totalOrders = 0;
    var totalRevenue = 0;

    for (order in orders.values()) {
      if (order.restaurantId == restaurantId) {
        totalOrders += 1;
        totalRevenue += order.totalPrice;
      };
    };

    {
      totalOrders;
      totalRevenue;
    };
  };

  // AI Assistant Chat
  public shared ({ caller }) func sendChatMessage(sessionId : Text, content : Text) : async Message {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send chat messages");
    };

    let id = getNextId();
    let message : Message = {
      id;
      sessionId;
      sender = caller;
      content;
      timestamp = Time.now();
    };

    let msgs = switch (messages.get(sessionId)) {
      case (null) {
        let newMsgs = List.empty<Message>();
        messages.add(sessionId, newMsgs);
        newMsgs;
      };
      case (?msgs) { msgs };
    };

    msgs.add(message);
    message;
  };

  public query ({ caller }) func getChatMessages(sessionId : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat messages");
    };

    switch (messages.get(sessionId)) {
      case (null) { [] };
      case (?msgs) {
        // Only return messages from sessions where the caller participated
        let allMessages = msgs.toArray();
        allMessages.filter(func(msg) { msg.sender == caller });
      };
    };
  };
};
