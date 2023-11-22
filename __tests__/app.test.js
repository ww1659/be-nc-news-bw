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

//GET TESTS
describe("GET api", () => {
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
describe("GET api/topics", () => {
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
describe("GET api/articles", () => {
  test("GET:200 returns an array of article objects with corresponding properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(10); // default PAGINATION
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
describe("GET api/articles/:article_id", () => {
  test("GET:200 returns an article object with corresponding properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: expect.any(String),
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
        expect(response.body.msg).toBe("invalid id");
      });
  });
});
describe("GET api/articles/:article_id/comments", () => {
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
        expect(response.body.msg).toBe("invalid id");
      });
  });
});
describe("GET api/users", () => {
  test("GET:200 returns an array of user objects with properties of 'username' and 'name' and 'avatar_url'", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("GET:404 returns status 404 for a non-existent path", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});
describe("GET api/users/:username", () => {
  test("GET:200 returns a single user object with properties of 'username', 'name' and 'avatar_url'", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then((response) => {
        const user = response.body.user;
        expect(user[0]).toMatchObject({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("GET:404 returns status 404 and error message for a non-existent username", () => {
    return request(app)
      .get("/api/users/billeh")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("user does not exist");
      });
  });
});

//POST TESTS
describe("POST api/articles", () => {
  test("POST:201 inserts a new article into the DB and returns this article to the user", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      topic: "cats",
      article_img_url: "any string here",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(201)
      .then((response) => {
        const newArticle = response.body.newArticle;
        expect(newArticle[0]).toMatchObject({
          article_id: 14,
          author: "butter_bridge",
          title: "BigGymFreakz",
          body: "Billeh has started going to the gym to get healthy for tennis",
          topic: "cats",
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: "0",
          article_img_url: expect.any(String),
        });
      });
  });
  test("POST:201 inserts a new article into the DB and returns this article to the user when no img_url is given", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      topic: "cats",
      article_img_url: "",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(201)
      .then((response) => {
        const newArticle = response.body.newArticle;
        expect(newArticle[0]).toMatchObject({
          article_id: 14,
          author: "butter_bridge",
          title: "BigGymFreakz",
          body: "Billeh has started going to the gym to get healthy for tennis",
          topic: "cats",
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: "0",
          article_img_url: expect.any(String),
        });
      });
  });
  test("POST:400 returns status 400 and error message when author, title, body and topic are not part of the request", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      article_img_url: "any string here",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid post query");
      });
  });
  test("POST:400 returns status 400 and error message when invalid properties on the post request", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      topic: "cats",
      article_img_url: "any string here",
      tennis: "best sport ever no?",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid post query");
      });
  });
  test("POST:400 returns status 400 and an error message if the user does not exist", () => {
    const testArticle = {
      author: "BILLEH",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      topic: "cats",
      article_img_url: "any string here",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
      });
  });
  test("POST:400 returns status 400 and an error message if the topic does not exist", () => {
    const testArticle = {
      author: "icellusedkars",
      title: "BigGymFreakz",
      body: "Billeh has started going to the gym to get healthy for tennis",
      topic: "dogs",
      article_img_url: "any string here",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
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
        expect(response.body.msg).toBe("invalid id");
      });
  });
});
describe("POST /api/topics", () => {
  test("POST:200 inserts a new topic into the DB and returns this topic to the user", () => {
    const testTopic = {
      slug: "TEST topic name here",
      description: "TEST description here",
    };
    return request(app)
      .post("/api/topics")
      .send(testTopic)
      .expect(201)
      .then((response) => {
        const newTopic = response.body.newTopic;
        expect(newTopic[0]).toMatchObject({
          slug: "TEST topic name here",
          description: "TEST description here",
        });
      });
  });
  test("POST:400 returns status and error message when neither slug nor description are part of the request", () => {
    const testTopic = {};
    return request(app)
      .post("/api/topics")
      .send(testTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
      });
  });
  test("POST:400 returns status 400 and error message when there are invalid properties on the request", () => {
    const testTopic = {
      isCool: true,
      slug: "chocolate",
      description: "butter_bridge",
      body: "THIS IS A TEST COMMENT",
    };
    return request(app)
      .post("/api/topics")
      .send(testTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid post");
      });
  });
  test("POST:400 returns status 400 and error message when a topic already exists", () => {
    const testTopic = {
      slug: "paper",
      description: "the new paper description",
    };
    return request(app)
      .post("/api/topics")
      .send(testTopic)
      .expect(422)
      .then((response) => {
        expect(response.body.msg).toBe("topic already exists");
      });
  });
});

//PATCH TESTS
describe("PATCH api/articles/:article_id", () => {
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
        expect(response.body.msg).toBe("invalid id");
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
describe("PATCH api/comments/:comment_id", () => {
  test("PATCH:200 returns the updated comment with positive increment", () => {
    const testVote = { incVotes: 110 };
    return request(app)
      .patch("/api/comments/4")
      .send(testVote)
      .expect(200)
      .then((response) => {
        const updatedComment = response.body.updatedComment;
        expect(updatedComment[0]).toMatchObject({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          votes: 10,
          author: "icellusedkars",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH:200 returns the updated comment with negative increment", () => {
    const testVote = { incVotes: -875 };
    return request(app)
      .patch("/api/comments/7")
      .send(testVote)
      .expect(200)
      .then((response) => {
        const updatedComment = response.body.updatedComment;
        expect(updatedComment[0]).toMatchObject({
          body: "Lobster pot",
          votes: -875,
          author: "icellusedkars",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH:404 returns status 404 and an error message if the comment ID does not exist", () => {
    const testVote = { incVotes: 10 };
    return request(app)
      .patch("/api/comments/400")
      .send(testVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("PATCH:404 returns status 404 and error message when incVotes is not part of the request", () => {
    const testVote = {};
    return request(app)
      .patch("/api/comments/4")
      .send(testVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no incVotes provided");
      });
  });
  test("PATCH:404 returns status 404 and error message when additional properties are on the patch request", () => {
    const testPatch = { incVotes: 15, testKey: true };
    return request(app)
      .patch("/api/comments/4")
      .send(testPatch)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "invalid patch: can only send the property incVotes"
        );
      });
  });
});

//DELETE TESTS
describe("DELETE api/comments/:comment_id", () => {
  test("DELETE:204 returns status 204 and has deleted corresponding comment", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
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
        expect(response.body.msg).toBe("invalid id");
      });
  });
});
describe("DELETE api/comments/:article_id", () => {
  test("DELETE:204 returns status 204 and has deleted corresponding article", () => {
    return request(app)
      .delete("/api/articles/3")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent article_id", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .delete("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id");
      });
  });
});

//QUERY TESTS
describe("QUERY TOPIC api/articles", () => {
  test("GET:200 returns a filtered array of article objects with corresponding properties", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(10); //default Pagination
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET:200 returns an empty array when there are no articles of valid topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toEqual([]);
      });
  });
  test("GET:404 returns status 404 and an error message when query is not valid", () => {
    return request(app)
      .get("/api/articles?votes=0")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});
describe("QUERY SORT / ORDER api/articles", () => {
  test("GET:200 returns an array of article objects sorted by the article_id query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });
  test("GET:200 returns an array of article objects sorted by the author query", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("GET:200 returns an array of article objects sorted by the comment_count query", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("GET:200 returns an array of article objects in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("GET:404 returns 404 and error message when invalid sorting parameter is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=JOB")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid sort_by parameter");
      });
  });
  test("GET:404 returns 404 and error message when invalid ordering parameter is passed", () => {
    return request(app)
      .get("/api/articles?order=UP")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid order parameter");
      });
  });
});
describe("QUERY PAGINATION api/articles", () => {
  test("GET:200 returns an limited array of article objects (limit = 3)", () => {
    return request(app)
      .get("/api/articles?limit=3&p=1")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
        expect(articles[3]).toBe(undefined);
        expect(articles.length).toBe(3);
        expect(total_count).toBe(13);
      });
  });
  test("GET:200 returns an limited array (length 10) of article objects when limit is not defined", () => {
    return request(app)
      .get("/api/articles?limit=&p=1")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles.length).toBe(10);
        expect(total_count).toBe(13);
      });
  });
  test("GET:200 returns an limited array starting at the first page when p is not defined", () => {
    return request(app)
      .get("/api/articles?limit=4&sort_by=article_id&order=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles[0].article_id).toBe(1);
        expect(articles[1].article_id).toBe(2);
        expect(articles[2].article_id).toBe(3);
        expect(articles[3].article_id).toBe(4);
        expect(articles.length).toBe(4);
        expect(total_count).toBe(13);
      });
  });
  test("GET:200 returns all article objects when limit is greater than the number of articles", () => {
    return request(app)
      .get("/api/articles?limit=20&p=1")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles.length).toBe(13);
        expect(total_count).toBe(13);
      });
  });
  test("GET:200 returns limited article objects starting at the offset", () => {
    return request(app)
      .get("/api/articles?limit=3&p=3&sort_by=article_id&order=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles[0].article_id).toBe(7);
        expect(articles[1].article_id).toBe(8);
        expect(articles[2].article_id).toBe(9);
        expect(total_count).toBe(13);
      });
  });
  test("GET:200 returns limited article objects starting at the offset when exceeding the number of articles", () => {
    return request(app)
      .get("/api/articles?limit=4&p=4&sort_by=article_id&order=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        const total_count = response.body.total_count;
        expect(articles[0].article_id).toBe(13);
        expect(total_count).toBe(13);
      });
  });
  test("GET:400 returns error status and message when limit is not valid", () => {
    return request(app)
      .get("/api/articles?limit=pint&p=0")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
      });
  });
  test("GET:400 returns error status and message when p is not valid", () => {
    return request(app)
      .get("/api/articles?limit=3&p=twelve")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
      });
  });
});
describe("QUERY PAGINATION api/articles/:article_id/comments", () => {
  test("GET:200 returns a limited array of comment objects (limit = 2)", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=2&p=1")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        const comment_count = response.body.comment_count;
        expect(comments[0]).toMatchObject({
          comment_id: 15,
          body: "I am 100% sure that we're not completely sure.",
          article_id: 5,
          author: "butter_bridge",
          votes: 1,
          created_at: expect.any(String),
        });
        expect(comment_count).toBe(2);
      });
  });
  test("GET:200 returns limited array of comments when p is not provided, defaulting at the first page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=4")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        const comment_count = response.body.comment_count;
        expect(comments[0]).toMatchObject({
          comment_id: 5,
          body: "I hate streaming noses",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
        });
        expect(comment_count).toBe(4);
      });
  });
  test("GET:200 returns limited array of comments when p is invalid - offset defaults to 0", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=donkey")
      .expect(200)
      .then((response) => {
        const comment_count = response.body.comment_count;
        expect(comment_count).toBe(3);
      });
  });
  test("GET:400 returns error status and message when limit is not a positive number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=-2")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("limit must be a positive number");
      });
  });
  test("GET:400 returns error and message when limit = 0", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("limit must be greater than 0");
      });
  });
  test("GET:400 returns error status and message when limit is not valid", () => {
    return request(app)
      .get("/api/articles/5/comments?limit=pint")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query");
      });
  });
});
