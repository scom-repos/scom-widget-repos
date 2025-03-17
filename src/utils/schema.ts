import { IDataSchema } from "@ijstech/components";

const getSchema = (scconfig: Record<string, any>, result: any) => {
  for (const key in scconfig) {
    const value = scconfig[key];
    if (typeof value === 'object') {
      const childSchema: any = {
        "type": "object",
        "properties": {}
      }
      result.properties[key] = childSchema;
      getSchema(value, result.properties[key]);
    } else {
      result.properties[key] = {
        type: 'string'
      }
    }
    return result;
  }
}

const workerSchemas = {
  "schema": {
    "type": "object",
    "properties": {
      "workers": {
        "type": "object",
        "description": "Map of worker definitions. The key is the worker name.",
        "patternProperties": {
          "^[a-zA-Z0-9_-]+$": {
            "type": "object",
            "properties": {
              "module": {
                "type": "string",
                "description": "Module path for the worker"
              },
              "plugins": {
                "type": "object",
                "description": "Predefined plugins for the worker",
                "properties": {
                  "cache": {
                    "type": "boolean"
                  },
                  "db": {
                    "type": "boolean"
                  },
                  "wallet": {
                    "type": "boolean"
                  },
                  "fetch": {
                    "type": "boolean"
                  }
                },
                "additionalProperties": false
              }
            },
            "required": ["module", "plugins"]
          }
        },
        "additionalProperties": false
      },
      "scheduler": {
        "type": "object",
        "properties": {
          "params": {
            "type": "object",
            "description": "Custom scheduler parameters",
            "additionalProperties": true
          },
          "schedules": {
            "type": "array",
            "description": "Array of schedule items",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Unique identifier for the schedule"
                },
                "cron": {
                  "type": "string",
                  "description": "Cron expression for schedule timing"
                },
                "worker": {
                  "type": "string",
                  "description": "Worker to run (must match a key in workers)"
                },
                "params": {
                  "type": "object",
                  "description": "Custom parameters for the schedule",
                  "additionalProperties": true
                }
              },
              "required": ["id", "cron", "worker", "params"]
            }
          }
        },
        "required": ["schedules"]
      },
      "router": {
        "type": "object",
        "properties": {
          "baseUrl": {
            "type": "string",
            "description": "Base URL for the router"
          },
          "routes": {
            "type": "array",
            "description": "Array of route definitions",
            "items": {
              "type": "object",
              "properties": {
                "methods": {
                  "type": "array",
                  "description": "HTTP methods allowed for this route",
                  "items": {
                    "type": "string",
                    "enum": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
                  }
                },
                "url": {
                  "type": "string",
                  "description": "Route URL (path)"
                },
                "worker": {
                  "type": "string",
                  "description": "Worker assigned to this route (must match a key in workers)"
                }
              },
              "required": ["methods", "url", "worker"]
            }
          }
        },
        "required": ["routes"]
      }
    },
    "required": ["workers", "scheduler", "router"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Workers",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/workers",
            "options": {
              "detail": {
                "type": "VerticalLayout",
                "elements": [
                  {
                    "type": "Control",
                    "scope": "#/properties/module"
                  },
                  {
                    "type": "Group",
                    "label": "Plugins",
                    "elements": [
                      {
                        "type": "Control",
                        "scope": "#/properties/plugins/properties/cache"
                      },
                      {
                        "type": "Control",
                        "scope": "#/properties/plugins/properties/db"
                      },
                      {
                        "type": "Control",
                        "scope": "#/properties/plugins/properties/wallet"
                      },
                      {
                        "type": "Control",
                        "scope": "#/properties/plugins/properties/fetch"
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "type": "Group",
        "label": "Scheduler",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/scheduler/properties/params",
            "options": {
              "multi": true,
              "format": "json"
            }
          },
          {
            "type": "Control",
            "scope": "#/properties/scheduler/properties/schedules",
            "options": {
              "detail": {
                "type": "VerticalLayout",
                "elements": [
                  {
                    "type": "Control",
                    "scope": "#/properties/id"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/cron",
                    "label": "Cron Expression"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/worker",
                    "options": {
                      "enum": [] 
                      /* This dropdown should be populated with keys from "workers" */
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/params",
                    "options": {
                      "multi": true,
                      "format": "json"
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "type": "Group",
        "label": "Router",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/router/properties/baseUrl"
          },
          {
            "type": "Control",
            "scope": "#/properties/router/properties/routes",
            "options": {
              "detail": {
                "type": "VerticalLayout",
                "elements": [
                  {
                    "type": "Control",
                    "scope": "#/properties/methods"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/url"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/worker",
                    "options": {
                      "enum": [] 
                      /* This dropdown should be populated with keys from "workers" */
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  }
}

export {
  getSchema,
  workerSchemas
}
