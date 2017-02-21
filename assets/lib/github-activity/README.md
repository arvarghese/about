github-activity [![Build Status](https://travis-ci.org/achan/github-activity.png?branch=master)](https://travis-ci.org/achan/github-activity) [![Code Climate](https://codeclimate.com/github/achan/github-activity.png)](https://codeclimate.com/github/achan/github-activity)
===============

This library displays the activity feed of a given GitHub user.

## Demo
See this library [in action](http://amos.pw/commits) using the built-in templates.

## Usage
Create a container for your activity feed along with a loading indicator that will be displayed while waiting for GitHub's response.

    <div id="activity-feed">Loading activity...</div>

If you want custom templates, you can create them as you would for any [Mustache templates](https://github.com/janl/mustache.js/). If no custom templates are provided, it will fallback to the default templates provided by the library.

**NOTE:** `githubActivity` provides a Mustache helper called `formatSha` that will shorten a changeset's SHA to 8 characters.

    <script type="text/template" id="no-events-tmpl">
      <div>There has been no recent activity.</div>
    </script>

    <script type="text/template" id="push-event-tmpl">
      <div class="event push-event">
        <div>{{created_at_in_words}}</div>
        <a href="http://github.com/{{actor.login}}">{{actor.login}}</a>
        pushed to <a href="http://github.com/{{repo.name}}">{{repo.name}}</a>
        <ul class="commits">
          {{#payload.commits}}
            <li class="commit">
              <span>{{#formatSha}}{{sha}}{{/formatSha}}</span>
              {{message}}
            </li>
          {{/payload.commits}}
        </ul>
      </div>
    </script>

    <script type="text/template" id="create-event-tmpl">
      <div class="event create-event">
        <div>{{created_at_in_words}}</div>
        <a href="http://github.com/{{actor.login}}">{{actor.login}}</a>
        created <a href="http://github.com/{{repo.name}}">{{repo.name}}</a>
      </div>
    </script>

All that's left to do is fire a GitHub Activity request with `requestActivity()`. `onCompleteCallback` will be called with the HTML compiled from your Mustache templates and GitHub's response.

    <script type="text/javascript">
      var options = {
        templates: {
          NoEvents: document.getElementById('no-events-tmpl').innerHTML,
          PushEvent: document.getElementById('push-event-tmpl').innerHTML,
          CreateEvent: document.getElementById('create-event-tmpl').innerHTML
        },
        username: 'achan',
        doc: document,
        onCompleteCallback: function (html) {
          document.getElementById('activity').innerHTML = html;
        }
      };

      githubActivity.requestActivity(options);
    </script>

## Bower
You can install this project and all its dependencies with the [Bower](http://bower.io) package manager with the command `bower install github-activity`. To manually install, see the Requirements section.

## Requirements
- [Mustache 0.7.2](https://github.com/janl/mustache.js/releases/tag/0.7.2)
- [Moment.js 2.1.0](https://github.com/moment/moment/releases/tag/2.1.0)

## Limitations
Since this plugin is using GitHub's public API via JSONP, it is subjected to GitHub's unauthenticated session API rate limit of 60 requests an hour.

## Contributions
Before sending a pull request, ensure that:

- all unit tests pass (and add some if necessary)
- JavaScript is linted with JSHint
- JavaScript is minified with uglify

All these things can be done by using the `grunt` command at the root of the project. If you aren't familiar with the [Grunt task runner](http://gruntjs.com), see their [Getting Started](http://gruntjs.com/getting-started) tutorial.
