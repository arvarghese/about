describe('GitHub Activity', function () {
  var options, script, body, doc, callback;

  beforeEach(function() {
    script = {};
    body = { appendChild: function (child) {} };
    doc = {
      createElement: function (elementName) {},
      body: body 
    };
    callback = function (html) {};
    options = {
      templates: {
        NoEvents: 'No Events',
        CreateEvent: 'Create Event',
        PushEvent: 'Push Event repo name: {{repo.name}}'
      },
      username: 'testuser',
      doc: doc,
      onCompleteCallback: callback
    };

    spyOn(doc, 'createElement').andReturn(script);
    spyOn(body, 'appendChild');
    spyOn(options, 'onCompleteCallback');
  });

  afterEach(function () {
    githubActivity.reset();
  });

  describe('requestActivity()', function () {
    afterEach(function () {
      githubActivity.reset();
    });

    describe('with custom templates', function () {
      beforeEach(function () {
        githubActivity.requestActivity(options);
      });

      it('requests github activity for the username specified', function () {
        expect(doc.createElement).toHaveBeenCalledWith('script');
        expect(script.src).toContain('https://api.github.com/users/testuser/events');
      });

      it('sets showActivity() as the callback', function () {
        expect(script.src).toContain('?callback=githubActivity.showActivity');
      });

      it('appends script to body', function () {
        expect(body.appendChild).toHaveBeenCalledWith(script);
      });
    });

    describe('with no templates provided', function () {
      it('uses default templates', function () {
        var noTemplates = {
          username: 'testuser',
          doc: doc,
          onCompleteCallback: callback
        };

        githubActivity.requestActivity(noTemplates);

        expect(noTemplates.templates).toBeDefined();
      });
    });
  });

  describe('reset()', function () {
    it('should require you to requestActivity() again', function () {
      githubActivity.requestActivity(options);
      githubActivity.reset();
      expect(githubActivity.showActivity).toThrow();
    });
  });

  describe('showActivity()', function () {
    it('throws exception if requestActivity has not been fired', function () {
      expect(githubActivity.showActivity).toThrow();
    });

    describe('properly setup', function () {
      var buildResponse = function (eventType) {
        var data = [];

        if (eventType instanceof Array) {
          for (var i in eventType) {
            data.push({ type: eventType[i] });
          }
        } else {
          data.push({ type: eventType });
        }

        return { data: data };
      };

      var pushEvent  = {
        type: "PushEvent",
        actor: { login: "achan", avatar_url: "http://example.com/avatar.jpg" },
        repo: { name: "achan/ignoramos" },
        payload: {
          size: 2,
          distinct_size: 2,
          ref: "refs/heads/master",
          commits: [
            {
            sha: "abbb394160808619329950ac311290d371b00251",
            author: { email: "example@gmail.com", name: "Amos Chan" },
            message: "example commit message",
          },
          {
            sha: "37b13593646cbb070b8707325980b33658dc3eac",
            author: {
              email: "example@gmail.com", name: "Amos Chan" },
              message: "example commit msg 2"
            }
          ]
        },
        public: true,
        created_at: "2013-09-01T02:26:39Z"
      };

      beforeEach(function () {
        githubActivity.requestActivity(options);
      });

      it('should indicate when there has been no recent activity', function () {
        githubActivity.showActivity();
        expect(options.onCompleteCallback).toHaveBeenCalledWith('No Events');
      });

      it('should render supported events', function () {
        githubActivity.showActivity(buildResponse('CreateEvent'));
        expect(options.onCompleteCallback).toHaveBeenCalledWith('Create Event');
      });

      it('should render view variables', function () {
        githubActivity.showActivity({ data: [pushEvent] });
        expect(options.onCompleteCallback.mostRecentCall.args[0]).toContain('achan&#x2F;ignoramos');
      });

      it('should skip over unsupported events', function () {
        githubActivity.showActivity(buildResponse(['CreateEvent', 'UnsupportedEvent']));
        expect(options.onCompleteCallback).toHaveBeenCalledWith('Create Event');
      });

      it('should show No Events template if feed only contains unsupported events', function () {
        githubActivity.showActivity(buildResponse(['UnsupportedEvent', 'UnsupportedEvent']));
        expect(options.onCompleteCallback).toHaveBeenCalledWith('No Events');
      });

      it('should enhance view with created_at_in_words', function () {
        spyOn(Mustache, 'render');
        githubActivity.showActivity({ data: [pushEvent] });
        expect(Mustache.render.mostRecentCall.args[1].created_at_in_words).toContain(' ago');
      });

      it('should enhance view to add function to format sha', function () {
        var customEvent = {
          type: 'PushEvent',
          payload: { commits: [{ sha: '123456789653' }] }
        };

        var pushTemplate = '{{#payload.commits}}{{#formatSha}}{{sha}}{{/formatSha}}{{/payload.commits}}';
        options.templates.PushEvent = pushTemplate;
        githubActivity.requestActivity(options);
        githubActivity.showActivity({ data: [customEvent] });
        expect(options.onCompleteCallback.mostRecentCall.args[0]).toBe('1234567');
      });
    });
  });
});
