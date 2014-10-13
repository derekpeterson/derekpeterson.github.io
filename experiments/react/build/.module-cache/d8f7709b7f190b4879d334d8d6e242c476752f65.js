/** @jsx React.DOM */
var CommentBox = React.createClass({displayName: 'CommentBox',
    render: function () {
        return (
            React.DOM.div({className: "commentBox"}, 
                React.DOM.h1(null, "Comments"), 
                CommentList({data:  this.props.data}), 
                CommentForm(null)
            )
        );
    }
});

var CommentList = React.createClass({displayName: 'CommentList',
    render: function () {
        var commentNodes = this.props.data.map(function ( comment ) {
            return (
                Comment({author:  comment.author}, 
                     comment.text
                )
            );
        });
        return (
            React.DOM.div({className: "commentList"}, 
                commentNodes 
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
        var comment = converter.makeHtml( this.props.children.toString() );
        return (
            React.DOM.div({className: "comment"}, 
                React.DOM.h2({className: "commentAuthor"}, 
                     this.props.author
                ), 
                React.DOM.span({dangerouslySetInnerHTML: { __html: comment}})
            )
        );
    }
});

var comments = [
    {
        author: "Pete Hunt",
        text: "This is one comment."
    },
    {
        author: "Jordan Walke",
        text: "This is *another* comment."
    }
];

React.renderComponent(
    CommentBox({data: comments }),
    document.getElementById( 'content' )
);
