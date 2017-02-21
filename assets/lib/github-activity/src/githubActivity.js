var githubActivity = (function() {
  var _templates  = {
    NoEvents: '<div>There has been no recent activity.</div>',
    PushEvent: '<div class="event push-event"> <div class="timestamp"><i class="icon-code"></i> {{created_at_in_words}}</div> <div class="event-description"> <a href="http://github.com/{{actor.login}}"><strong>{{actor.login}}</strong></a> pushed to <a href="http://github.com/{{repo.name}}"><strong>{{repo.name}}</strong></a> </div> <ul class="commits"> {{#payload.commits}} <li class="commit"> <a class="sha" href="https://github.com/{{repo.name}}/commit/{{sha}}">{{#formatSha}}{{sha}}{{/formatSha}}</a> {{message}} </li> {{/payload.commits}} </ul> </div>',
    CreateEvent: '<div class="event create-event"> <div class="timestamp"><i class="icon-plus"></i> {{created_at_in_words}}</div> <div class="event-description"> <a href="http://github.com/{{actor.login}}"><strong>{{actor.login}}</strong></a> created repository <a href="http://github.com/{{repo.name}}"><strong>{{repo.name}}</strong></a> </div> </div>'
  };

  var _options = false;

  var setOptions = function (options) {
    _options = options;
  };

  var getOptions = function () {
    return _options;
  };

  var formatFeed = function (events) {
    var output = '';

    for (var key in events)
      output += buildOutputForEvent(events[key]);

    return output === '' ? Mustache.render(_options.templates.NoEvents) :
                           output;
  };

  var formatShaHelper = function () {
    return function (text, render) {
      return render(text).substring(0, 7);
    };
  };

  var buildOutputForEvent = function (event) {
    var eventType = event.type, templates = _options.templates;

    if (templates[eventType]) {
      augmentEvent(event, { formatSha: formatShaHelper, moment: moment });
      return Mustache.render(templates[eventType], event);
    }

    return '';
  };

  var augmentEvent = function (event, helpers) {
    event.formatSha = helpers.formatSha;
    event.created_at_in_words = helpers.moment(event.created_at).fromNow();
  };

  var onCompleteCallback = function (html) {
    _options.onCompleteCallback(html);
  };

  var buildFetchEventsUrl = function (username) {
    return 'https://api.github.com/users/' +
           _options.username +
           '/events?callback=githubActivity.showActivity';
  };

  var activity = {
    showActivity: function(response) {
      if (!getOptions())
        throw 'Must requestActivity before showActivity: getOptions';

      if (!response) {
        var output = Mustache.render(getOptions().templates.NoEvents);
        return onCompleteCallback(output);
      }

      return onCompleteCallback(formatFeed(response.data));
    },

    requestActivity: function(options) {
      if (!options.templates)
        options.templates = _templates;

      var script = options.doc.createElement('script');

      setOptions(options);
      script.src = buildFetchEventsUrl(options.username);
      options.doc.body.appendChild(script);
    },

    reset: function() {
      setOptions(null);
    }
  };

  return activity;
}) ();
