## Background
This project was created with Node.js with Express and MongoDB with Mongoose. I created this simple API to experiment with API documentation tools.

I am using [Heroku](https://www.heroku.com/) to host a live version of the app so that the interactive tools are usable.

For this project, I've chosen to document the API with three different tools: [Swagger UI](https://swagger.io/tools/swagger-ui/), [Stoplight](https://stoplight.io/), and [Markdown](https://en.wikipedia.org/wiki/Markdown). I created a yaml file that follows the [OpenAPI Specification Version 3.0.3](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md) and used both Swagger UI and Stoplight to render the documentation. I also created the documentation using Markdown, which is the bulk of this readme. Select the links below to check out the results of each.

- [API documentation using Swagger UI](https://guarded-eyrie-88809.herokuapp.com/api-docs)
- [API documentation using Stoplight](https://rmcknight.stoplight.io/docs/riddles-api/)
- [API documentation using Markdown](#riddles-api-documentation)


# Riddles API Documentation

### Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Endpoints to get riddles in bulk or by id](#endpoints-for-getting-riddles-in-bulk-or-by-id)
  - [Endpoints to get a random riddle](#endpoints-for-getting-one-random-riddle)
  - [Endpoints to create or delete a riddle](#endpoints-for-creating-or-deleting-a-riddle)
  - [Endpoints to modify a riddle](#endpoints-for-modifying-a-riddle)

## Overview
The Riddles API can return riddles from a variety of categories. Current categories include easy, hard, kids, math, word, and funny. Request one random riddle or request them all. Seed data for the original riddle database is from [https://parade.com/947956/parade/riddles/](https://parade.com/947956/parade/riddles/). New riddles can be added and updated via the API."

**Riddles API Server**:  https://guarded-eyrie-88809.herokuapp.com

## Authentication
No authentication is needed to use this API.

## Endpoints
The API's endpoints and functions are listed and described in the following sections. 

- [Endpoints to get riddles in bulk or by id](#endpoints-for-getting-riddles-in-bulk-or-by-id):
  - [Get all riddles or an individual riddle](#-to-get-all-riddles-or-an-individual-riddle)
  - [Get all riddles from a specific category](#-to-get-all-riddles-from-a-specific-category)
- [Endpoints to get one random riddle](#endpoints-for-getting-one-random-riddle):
  - [Select a random riddle from the database](#-to-select-a-random-riddle-from-the-entire-database)
  - [Select a random riddle from a specific category](#-to-select-a-random-riddle-from-a-specific-category)
- [Endpoints to create or delete a riddle](#endpoints-for-creating-or-deleting-a-riddle):
  - [Add a riddle to the database](#-to-add-a-new-riddle-to-the-database)
  - [Delete a riddle from the database](#-to-delete-a-riddle-from-the-database)
- [Endpoints to modify a riddle](#endpoints-for-modifying-a-riddle):
  - [Update an existing riddle by overwriting](#-to-update-an-existing-riddle-by-overwriting)
  - [Update a field of an existing riddle](#-to-update-a-field-of-an-existing-riddle)

### Endpoints for getting riddles in bulk or by id

#### 📌 To get all riddles or an individual riddle

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles | Returns Riddle objects |

Use the optional `id` query parameter to have the corresponding Riddle object returned. Omit the query parameter to have an array of all the Riddle objects in the database returned.

The optional query parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Optional | If the database id for a riddle is known, use this parameter to get that specific Riddle object. **Omit for all riddles to be returned.** |

Example curl request to get all riddles:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles'
```

The response will be an array of Riddle objects.

Example successful response of an array of riddles:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "_id": "60bc3ffb5dcf8ac52f16a7fd",
    "riddle": "What has to be broken before you can use it?",
    "answer": "An egg",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/"
  },
  {
    "_id": "60bc3ffb5dcf8ac52f16a800",
    "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    "answer": "A candle",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/"
  }
]
```

The same endpoint can be used with the `id` query parameter to get an individual riddle. 

Example curl request to get an individual riddle:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles?id=60bd0708d7dcc31bd9376abe'
```

The response will be an individual Riddle object.

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "_id": "60bd0708d7dcc31bd9376abe",
  "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
  "answer": "A candle",
  "category": "easy",
  "source": "https://parade.com/947956/parade/riddles/"
}
```
The Riddle object returned uses this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Possible errors:

| Error code | Description |
| --- | --- |
| 404 | `Not Found`: This error will occur if the requested riddle `id` is not found in the database. It could also occur if the database is empty. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

#### 📌 To get all riddles from a specific category

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/{category} | Returns all riddles from a specific category |

Pass the desired category as a path parameter in the request. An array of Riddle objects matching the specific category is returned.

The path parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| category | string | Required | A riddle category. The seed data (original riddles added to the database) include the following categories: easy, hard, funny, kids, math, and word. |

Example curl request to get all riddles:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles/easy'
```

The response will be an array of Riddle objects.

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "_id": "60bd0708d7dcc31bd9376abe",
    "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    "answer": "A candle",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/"
  }
]
```
The Riddle objects returned use this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Possible errors:

| Error code | Description |
| --- | --- |
| 404 | `Not Found`: This error will be returned if there are no riddles with the requested `category` in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

### Endpoints for getting one random riddle

#### 📌 To select a random riddle from the entire database:

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/random | Returns a random riddle |

Make a `GET` request. A random Riddle object from the entire database is selected and returned.

Example curl request:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles/random'
```

A successful response will return an HTTP status code of `200`. The Riddle object returned uses this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "_id": "60bd0708d7dcc31bd9376abe",
  "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
  "answer": "A candle",
  "category": "easy",
  "source": "https://parade.com/947956/parade/riddles/"
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 404 | `Not Found`: This error will be returned if there are no riddles in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

#### 📌 To select a random riddle from a specific category:

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/{category}/random | Returns a random riddle from the category specified |

Pass the desired category as a path parameter in the request. A random Riddle object from the specified category will be selected and returned. 

The path parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| category | string | Required | A riddle category. The seed data (original riddles added to the database) include the following categories: easy, hard, funny, kids, math, and word. |

Example curl request:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles/easy/random'
```
A successful response will return an HTTP status code of `200`. The Riddle object returned uses this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "_id": "60bd0708d7dcc31bd9376abe",
  "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
  "answer": "A candle",
  "category": "easy",
  "source": "https://parade.com/947956/parade/riddles/"
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 404 | `Not Found`: This error will be returned if there are no riddles with the requested `category` in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

### Endpoints for creating or deleting a riddle

#### 📌 To add a new riddle to the database

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `POST` | /riddles | Adds a new riddle to the database |

Use the JSON request body to add a new Riddle object to the database.

The request body should use the following schema:

| Field | Type | Required | Description |
| --- | ---| ---| ---|
| riddle | string | Required | The riddle's question |
| answer | string | Required | The riddle's answer |
| category | string | Required | A one-word classification of the riddle. It should not contain spaces. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | Optional | The source of the riddle |

**Note**: The `Content-Type` header should be set to `application/json`.

Example curl request:
```
curl -X POST \
  'https://guarded-eyrie-88809.herokuapp.com/riddles' \
  -H 'Content-Type: application/json' \
  -d '{
  "riddle": "There'\''s only one word in the dictionary that'\''s spelled wrong. What is it?",
  "answer": "The word '\''wrong.'\'' It'\''s the only word that'\''s spelled W-R-O-N-G.",
  "category": "kids",
  "source": "https://www.prodigygame.com/main-en/blog/riddles-for-kids/"
}'
```

A successful response will return an HTTP status code of `201` and have the following schema:

| Field | Type | Description |
| --- | ---| ---|
| message | string | A brief success message |
| content | object | Top-level containing Riddle object |

Where the Riddle object has this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |
| __v | number | An internal versioning number used by Mongoose (the Object Data Model library used to connect to the MongoDB database). |

Example successful response:
```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "Successfully added new riddle",
  "content": {
    "_id": "60bd0708d7dcc31bd9376abe",
    "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    "answer": "A candle",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/",
    "__v": 0
  }
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 400 | `Bad Request`: This error will be return if a required field in the request body is missing or if the `category` field contains a space. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

#### 📌 To delete a riddle from the database

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `DELETE` | /riddles | Deletes a riddle from the database |

Select a Riddle object to delete by setting the query parameter to its `id`. Currently, deleting seed data (the original riddles added to the database) is not allowed.

The query parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Required | The database `id` for the riddle. This is needed for `PUT`, `PATCH`, or `DELETE` requests which are operations performed on an existing riddle. |

Example curl request:
```
curl -X DELETE 'https://guarded-eyrie-88809.herokuapp.com/riddles?id=60bc3adb1e6946b94ca7a70a'
```

A successful response will return an HTTP status code of `200` and have the following schema:

| Field | Type | Description |
| --- | ---| ---|
| message | string | A brief success message |

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": Successfully deleted riddle"
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 403 | `Forbidden`: This error will be returned if you try to delete the seed data (the original riddles added to the database).|
| 404 | `Not Found`: This error will occur if the requested riddle `id` is not found in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

### Endpoints for modifying a riddle

#### 📌 To update an existing riddle by overwriting

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `PUT` | /riddles | Updates (by overwriting) a riddle in the database |

Select a Riddle object to update by setting the query parameter to its `id`. Use the JSON request body to set new values. Fields set in the request body will overwrite all existing values. Omitting a non-required field from the request body sets that field to null. Currently, updating seed data (the original riddles added to the database) is not allowed.

The query parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Required | The database `id` for the riddle. This is needed for `PUT`, `PATCH`, or `DELETE` requests which are operations performed on an existing riddle. |

The request body should use the following schema:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| riddle | string | Required | The riddle's question |
| answer | string | Required | The riddle's answer |
| category | string | Required | A one-word classification of the riddle. It should not contain spaces. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | Optional | The source of the riddle |

**Note**: The `Content-Type` header should be set to `application/json`.

Example curl request:
```
curl -X PUT \
  'http://guarded-eyrie-88809.herokuapp.com/riddles?id=60bd0708d7dcc31bd9376abe' \
  -H 'Content-Type: application/json' \
  -d '{
  "riddle": "There'\''s only one word in the dictionary that'\''s spelled wrong. What is it?",
  "answer": "The word '\''wrong.'\'' It'\''s the only word that'\''s spelled W-R-O-N-G.",
  "category": "kids",
  "source": "https://www.prodigygame.com/main-en/blog/riddles-for-kids/"
}'
```

A successful response will return an HTTP status code of `200` and have the following schema:

| Field | Type | Description |
| --- | ---| ---|
| message | string | A brief success message |
| content | object | Top-level containing Riddle object |

Where the Riddle object has this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Successfully updated riddle",
  "content": {
    "_id": "60bd0708d7dcc31bd9376abe",
    "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    "answer": "A candle",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/",
  }
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 400 | `Bad Request`: This error will be return if a required field in the request body is missing or if the `category` field contains a space. |
| 403 | `Forbidden`: This error will be returned if you try to modify the seed data (the original riddles added to the database). |
| 404 | `Not Found`: This error will occur if the requested riddle `id` is not found in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to endpoints list](#endpoints)

***

#### 📌 To update a field of an existing riddle

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `PATCH` | /riddles | Updates individual fields of a riddle in the database |

Select a Riddle object to update by setting the query parameter to its `id`. Use the JSON request body to set one or more fields to a new value. Omitted fields retain their values. Currently, updating seed data (the original riddles added to the database) is not allowed.

The query parameter is defined as:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Required | The database `id` for the riddle. This is needed for `PUT`, `PATCH`, or `DELETE` requests which are operations performed on an existing riddle. |

The request body should use the following schema:

| Field | Type | Optional | Description |
| --- | --- | --- | --- |
| riddle | string | Optional | An update to the riddle's question |
| answer | string | Optional | An update to the riddle's answer |
| category | string | Optional | An update to the classification of the riddle. It should be one-word and not contain spaces. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | Optional | An update to the source of the riddle |

**Note**: The `Content-Type` header should be set to `application/json`.

Example curl request:
```
curl -X PATCH \
  'http://guarded-eyrie-88809.herokuapp.com/riddles?id=60bd0708d7dcc31bd9376abe' \
  -H 'Content-Type: application/json' \
  -d '{
  "riddle": "There'\''s only one word in the dictionary that'\''s spelled wrong. What is it?",
  "answer": "The word '\''wrong.'\'' It'\''s the only word that'\''s spelled W-R-O-N-G.",
  "category": "kids",
  "source": "https://www.prodigygame.com/main-en/blog/riddles-for-kids/"
}'
```

A successful response will return an HTTP status code of `200` and have the following schema:

| Field | Type | Description |
| --- | ---| ---|
| message | string | A brief success message |
| content | object | Top-level containing Riddle object |

Where the Riddle object has this schema:

| Field | Type | Description |
| --- | ---| ---|
| _id | string | The database id for the Riddle object |
| riddle | string | The riddle's question |
| answer | string | The riddle's answer |
| category | string | A classification of the riddle. The original database includes the categories: easy, hard, funny, kids, math, and word. This is not an enum and more can be added. |
| source | string | The source of the riddle |

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": Successfully updated riddle",
  "content": {
    "_id": "60bd0708d7dcc31bd9376abe",
    "riddle": "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    "answer": "A candle",
    "category": "easy",
    "source": "https://parade.com/947956/parade/riddles/",
  }
}
```

Possible errors:

| Error code | Description |
| --- | --- |
| 400 | `Bad Request`: This error will be return if a required field in the request body is missing or if the `category` field contains a space. |
| 403 | `Forbidden`: This error will be returned if you try to modify the seed data (the original riddles added to the database). |
| 404 | `Not Found`: This error will occur if the requested riddle `id` is not found in the database. |
| 500 | `Internal Server Error`: An unexpected error occurred on the server. |

[Back to top](#riddles-api-documentation)