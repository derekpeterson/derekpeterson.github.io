/** @jsx React.DOM */
var CommentBox = React.createClass({displayName: 'CommentBox',
    render: function () {
        return (
            React.DOM.div({className: "commentBox"}, 
                React.DOM.h1(null, "Comments"), 
                CommentList(null), 
                CommentForm(null)
            )
        );
    }
});

var CommentList = React.createClass({displayName: 'CommentList',
    render: function () {
        return (
            React.DOM.div({className: "commentList"}, 
                Comment({author: "Pete Hunt"}, "This is one comment"), 
                Comment({author: "Jordan Walke"}, "This is *another* comment.")
            )
        );
    }
});

var CommentForm = React.createClass({displayName: 'CommentForm',
    render: function () {
        return (
            React.DOM.div({className: "commentForm"}, 
                React.DOM.input({type: "text", placeholder: "What do you think?"})
            )
        );
    }
});

var converter = new Showdown.converter();
var Comment = React.createClass({displayName: 'Comment',
    render: function () {
        return (
            React.DOM.div({className: "comment"}, 
                React.DOM.h2({className: "commentAuthor"}, 
                     this.props.author
                ), 
                 converter.makeHTML( this.props.children) 
            )
        );
    }
});

React.renderComponent(
    CommentBox(null),
    document.getElementById( 'content' )
);
