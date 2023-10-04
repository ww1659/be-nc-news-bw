const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const localEndpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("api", () => {
  test("GET:200 returns an object of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endPoints = response.body.endPoints;
        expect(endPoints).toEqual(localEndpoints);
      });
  });
});

describe("api/topics", () => {
  test("GET:200 returns an array of topic objects with properties of 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET:404 returns status 404 for a non-existent path", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});

describe("api/articles", () => {
  test("GET:200 returns an array of article objects with corresponding properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(13);
        expect(articles[0].comment_count).toBe("2");
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("GET:404 returns status 404 for a non-existent path", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});

describe("api/articles/:article_id", () => {
  test("GET:200 returns an article object with corresponding properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        // const dateCreated = new Date(article.created_at);
        // expect(article[0]).toMatchObject({
        //   title: "Eight pug gifs that remind me of mitch",
        //   topic: "mitch",
        //   author: "icellusedkars",
        //   body: "some gifs",
        //   created_at: new Date(1604394720000),
        //   article_img_url:
        //     "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        // });
        article.forEach((article) => {
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("some gifs");
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.votes).toBe(0);
          expect(article.article_id).toBe(3);
        });
      });
  });
  test("GET:404 returns status 404 and error message for a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/19")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("GET:400 returns status 400 and error message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 returns an array of comments for specific article Id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment.article_id).toEqual(5);
        });
      });
  });
  test("GET:200 returns status 200 and error message for an valid article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.msg).toBe(
          "There are no comments for this article."
        );
      });
  });
  test("GET:404 returns status 404 and error message for a non existent article id", () => {
    return request(app)
      .get("/api/articles/23/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("GET:400 returns status 400 and error message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:200 inserts a new comment into the DB and returns this comment to the user", () => {
    const testComment = {
      username: "butter_bridge",
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        const newComment = response.body.comment;
        expect(newComment[0]).toMatchObject({
          article_id: 4,
          author: "butter_bridge",
          body: expect.any(String),
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("POST:404 returns status 404 and error message when username is not part of the request", () => {
    const testComment = {
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no username provided");
      });
  });
  test("POST:404 returns status 404 and error message when there are invalid properties on the request", () => {
    const testComment = {
      isCool: true,
      flavour: "chocolate",
      username: "butter_bridge",
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid post");
      });
  });
  test("POST:404 returns status 404 and an error message if the user does not exist", () => {
    const testComment = {
      username: "BILLEH",
      body: "THIS IS A TEST BODY",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  });
  test("POST:404 returns status 404 and an error message if the article ID does not exist", () => {
    const testComment = {
      username: "butter_bridge",
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/articles/400/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("POST:400 returns status 400 and error message for an invalid article id", () => {
    const testComment = {
      username: "butter_bridge",
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/articles/peter/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
});

describe("PATCH /api/articles/:article_id/comments", () => {
  test("PATCH:200 updates the votes count for a specified article ID and returns this updated article", () => {
    const testPatch = { incVotes: 5 };
    return request(app)
      .patch("/api/articles/4")
      .send(testPatch)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle[0]).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:404 returns status 404 and an error message if the article ID does not exist", () => {
    const testPatch = { incVotes: 10 };
    return request(app)
      .patch("/api/articles/400")
      .send(testPatch)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("PATCH:400 returns status 400 and error message for an invalid article id", () => {
    const testPatch = { incVotes: 15 };
    return request(app)
      .patch("/api/articles/peter")
      .send(testPatch)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
  test("PATCH:404 returns status 404 and error message when incVotes is not part of the request", () => {
    const testPatch = {};
    return request(app)
      .patch("/api/articles/4")
      .send(testPatch)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no incVotes provided");
      });
  });
  test("PATCH:404 returns status 404 and error message when additional properties are on the patch request", () => {
    const testPatch = { incVotes: 15, testKey: true };
    return request(app)
      .patch("/api/articles/4")
      .send(testPatch)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "invalid patch: can only send the property incVotes"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 returns status 204 and has deleted corresponding comment", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid comment id");
      });
  });
});
