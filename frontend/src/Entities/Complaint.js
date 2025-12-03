{
  "name": "Complaint",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the complaint"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the civic issue"
    },
    "category": {
      "type": "string",
      "enum": [
        "road",
        "water",
        "utilities",
        "health",
        "other"
      ],
      "default": "road",
      "description": "Category of the complaint"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "in-progress",
        "resolved"
      ],
      "default": "pending",
      "description": "Current status of the complaint"
    },
    "location": {
      "type": "string",
      "description": "Address or description of the location"
    },
    "latitude": {
      "type": "number",
      "description": "Latitude coordinate"
    },
    "longitude": {
      "type": "number",
      "description": "Longitude coordinate"
    },
    "image_url": {
      "type": "string",
      "description": "URL of uploaded image evidence"
    },
    "citizen_name": {
      "type": "string",
      "description": "Name of the citizen who filed the complaint"
    },
    "remark": {
      "type": "string",
      "description": "Government remark or update"
    }
  },
  "required": [
    "title",
    "category"
  ]
}