## Background
This project was created with Node.js with Express and MongoDB with Mongoose. I created this simple API to experiment with API documentation tools.

I am using [Heroku](https://www.heroku.com/) to host a live working version of the app so that the interactive tools can actually be used.

For this project, I've chosen to document the API with three different tools: [Swagger UI](https://swagger.io/tools/swagger-ui/), [Stoplight](https://stoplight.io/), and [Markdown](https://en.wikipedia.org/wiki/Markdown). I created a yaml file that follows the [OpenAPI Specification Version 3.0.3](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md) and used both Swagger UI and Stoplight to render the documentation. I also created the documentation using Markdown, which is the bulk of this readme. Select the links below to check out the results of each.

- [API documentation using Swagger UI](https://guarded-eyrie-88809.herokuapp.com/api-docs)
- [API documentation using Stoplight](https://rmcknight.stoplight.io/docs/riddles-api/)
- [API documentation using Markdown](#riddles-api-documentation)


# Riddles API Documentation

### Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Endpoints used to get a random riddle](#endpoints-for-getting-one-random-riddle)
  - [Endpoints used to create a riddle](#endpoints-for-creating-a-riddle)
  - [Endpoints used to modify a riddle](#endpoints-for-modifying-a-riddle)
  - [Endpoints used to get riddles](#endpoints-for-getting-riddles)


## Overview
This API allows you to get riddles and their answers, in various categories. The current categories of riddles include easy, hard, kids, math, word, and funny. In addition to requesting riddles in bulk, the endpoints allow you to request one random riddle from the entire database or one random riddle from a specific category. Seed data for the original riddle database is from [https://parade.com/947956/parade/riddles/](https://parade.com/947956/parade/riddles/). New riddles can be added and updated via the API.

**Riddles API Server**:  https://guarded-eyrie-88809.herokuapp.com

## Authentication
No authentication is needed to use this API.

## Endpoints
The API's endpoints and functions are listed and described in the following sections. 

- [Endpoints used to get one random riddle](#endpoints-for-getting-one-random-riddle):
  - [Select a random riddle from the database](#📌-to-select-a-random-riddle-from-the-entire-database)
  - [Select a random riddle from a specific category](#📌-to-select-a-random-riddle-from-a-specific-category)
- [Endpoints used to create a riddle](#endpoints-for-creating-a-riddle):
  - [Add a new riddle to the database](#📌-to-add-a-new-riddle-to-the-database)
- [Endpoints used to modify a riddle](#endpoints-for-modifying-a-riddle):
  - [Update an existing riddle](#📌-to-update-an-existing-riddle)
  - [Update a field of an existing riddle](#📌-to-update-a-field-of-an-existing-riddle)
  - [Delete a riddle](#📌-to-delete-a-riddle)
- [Endpoints used to get riddles](#endpoints-for-getting-riddles):
  - [Get all riddles or an individual riddle](#📌-to-get-all-riddles-or-an-individual-riddle)
  - [Get all riddles from a specific category](#📌-to-get-all-riddles-from-a-specific-category)

### Endpoints for getting one random riddle

#### 📌 To select a random riddle from the entire database:

A random riddle from the entire database will be selected and returned. The response will be a Riddle object.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/random | Returns a random riddle with the answer |

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

A random riddle from a specific category will be selected and returned. The desired category is passed as a path parameter. The response will be a Riddle object.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/{category}/random | Returns a random riddle with the answer from a category |

The path parameter has the following definition:

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

### Endpoints for creating a riddle

#### 📌 To add a new riddle to the database

You can add a new riddle to the database using a JSON request body.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `POST` | /riddles | Adds a new riddle to the database |

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

### Endpoints for modifying a riddle

#### 📌 To update an existing riddle

You can update a riddle in the database by using its `id` as a query parameter and passing a JSON request body with the new values. All fields will be overwritten with the fields given in the request body. If any non-required fields are left out of the request body, they will be overwritten as null. Currently, updating seed data (the original riddles added to the database) is not allowed.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `PUT` | /riddles | Updates a riddle in the database |

The query parameter has the following definition:

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

You can update fields of a riddle in the database by using its `id` as a query parameter and passing a JSON request body with the updated values. Currently, updating seed data (the original riddles added to the database) is not allowed.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `PATCH` | /riddles | Updates fields of a riddle in the database |

The query parameter has the following definition:

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

[Back to endpoints list](#endpoints)

***

#### 📌 To delete a riddle

You can delete a riddle in the database by using its `id` as a query parameter. Currently, deleting seed data (the original riddles added to the database) is not allowed.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `DELETE` | /riddles | Deletes a riddle in the database |

The query parameter has the following definition:

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

### Endpoints for getting riddles

#### 📌 To get all riddles or an individual riddle

When using the optional `id` query parameter, the corresponding Riddle object will be returned. Without using the query parameter, this endpoint will return an array of all Riddle objects stored in the database.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles | Returns Riddle objects, which contain the riddle's question and answer |

The optional query parameter has the following definition:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Optional | If you know the database id associated with a riddle, you can use this parameter to get that specific Riddle object. **Omit for all riddles to be returned.** |

Example curl request to get all riddles:
```
curl -X GET 'https://guarded-eyrie-88809.herokuapp.com/riddles'
```

The response will be an array of Riddle objects.

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

An array of all the riddles matching the specific category is returned. The desired category is passed as a path parameter.

| HTTP Method | Endpoint | Summary |
| --- | --- | --- |
| `GET` | /riddles/{category} | Returns all riddles with answers, from a specific category |

The path parameter has the following definition:

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

[Back to top](#riddles-api-documentation)