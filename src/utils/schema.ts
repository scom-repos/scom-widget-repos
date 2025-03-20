function getWorkersSchema(workers: Record<string, any>) {
  if (!workers) return {};
  const result = {
    "properties": {}
  }

  for (const key in workers) {
    result.properties[key] = {
      "type": 'object',
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
  }

  return result.properties;
}

const getWorkersSchemas = (scconfig: Record<string, any>) => {
  const workers = getWorkersSchema(scconfig.workers);
  const workerKeys = Object.keys(workers);

  return {
    "schema": {
      "type": "object",
      "properties": {
        "scheduler": {
          "type": "object",
          "properties": {
            "params": {
              "type": "object",
              "description": "Custom scheduler parameters"
              // "additionalProperties": true
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
                    "description": "Worker to run (must match a key in workers)",
                    "enum": workerKeys
                  },
                  "params": {
                    "type": "object",
                    "description": "Custom parameters for the schedule"
                    // "additionalProperties": true
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
                    "description": "Worker assigned to this route (must match a key in workers)",
                    "enum": workerKeys
                  }
                },
                "required": ["methods", "url", "worker"]
              }
            }
          },
          "required": ["routes"]
        }
      },
      "required": ["scheduler", "router"]
    },
    "uischema": {
      "type": "VerticalLayout",
      "elements": [
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
                      "scope": "#/properties/worker"
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
                      "scope": "#/properties/worker"
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
}

export {
  getWorkersSchemas
}
