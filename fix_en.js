const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'frontend', 'src', 'locales', 'en', 'translation.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.dashboards.restaurant = {
  "management": {
    "title": "Manage your Requests"
  },
  "stats": {
    "total": "Total",
    "pending": "Pending",
    "accepted": "Accepted",
    "in_my_local": "In the local",
    "sold": "Sold"
  },
  "filters": {
    "title": "Filters",
    "all": "All",
    "pending": "Pending",
    "accepted": "Accepted",
    "in_transit": "In transit",
    "in_my_local": "In the local",
    "sold": "Sold"
  },
  "table": {
    "title": "Your requests",
    "count_singular": "request",
    "count_plural": "requests",
    "empty": "No requests available with this filter",
    "cols": {
      "image": "Image",
      "details": "Details",
      "type": "Type",
      "status": "Status",
      "prices": "Prices",
      "date": "Date",
      "actions": "Actions"
    },
    "actions": {
      "view": "View",
      "edit": "Edit",
      "delete": "Delete",
      "receive": "I received",
      "receiving": "Receiving...",
      "sell": "I sold",
      "selling": "Selling..."
    }
  },
  "status": {
    "pending": "Pending",
    "accepted": "Accepted",
    "in_transit": "In Transit",
    "in_my_local": "In the Local",
    "sold": "Sold",
    "cancelled": "Cancelled",
    "unknown": "Unknown"
  },
  "view": {
    "price_demanded": "Demanded price",
    "price_restaurant": "Restaurant price",
    "request_date": "Request date",
    "product_details": "Product details",
    "origin": "Origin",
    "wine_type": "Wine type",
    "not_specified": "Not specified",
    "not_found": "Request not found",
    "back": "Back"
  },
  "modals": {
    "delete": {
      "title": "Are you sure you want to delete this request?",
      "desc": "This action cannot be undone. Your request will be permanently deleted.",
      "warning": "By deleting the request, you will have to add it again if you want to sell it again.",
      "btn_cancel": "Cancel",
      "btn_confirm": "Delete"
    },
    "edit": {
      "title": "Modify price {{name}}",
      "desc": "Enter the new price you want to offer for this product",
      "field_new_price": "New price (€)",
      "placeholder": "Enter the new price",
      "error_invalid_price": "Please, enter a valid price",
      "current_price": "Current price",
      "your_offer": "Your offer",
      "offer_higher": "(Higher than current price)",
      "offer_lower": "(Lower than current price)",
      "offer_equal": "(Equal to current price)",
      "success": "Price updated successfully!",
      "btn_cancel": "Cancel",
      "btn_submit": "Update price"
    }
  },
  "messages": {
    "error_server": "Could not connect to the server",
    "error_delete": "Could not delete the request",
    "success_delete": "Request deleted successfully",
    "error_update": "Could not update the request",
    "error_receive": "Error marking as received",
    "success_receive": "Product received successfully",
    "error_sell": "Error marking as sold",
    "success_sell": "Product sold successfully",
    "error_fetch": "Could not fetch the request information.",
    "error_unknown": "Unknown error",
    "invalid_id": "Invalid request ID",
    "error_update_status": "Error updating status"
  }
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('Done');
