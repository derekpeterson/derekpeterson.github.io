/** @jsx React.DOM */
var CommentBox = React.createClass({displayName: 'CommentBox',
    getInitialState: function () {
        return {
            data: []
        };
    },
    componentDidMount: function () {
        jQuery.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function ( data ) {
                this.setState({
                    data: data
                });
            }.bind( this ),
            error: function ( xhr, status, err ) {
                console.error( this.props.url, status, err.toString() );
            }.bind( this )
        });
    },
    render: function () {
        return (
            React.DOM.div({className: "commentBox"}, 
                React.DOM.h1(null, "Comments"), 
                CommentList({data:  this.state.data}), 
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

React.renderComponent(
    CommentBox({url: "data/comments.json"}),
    document.getElementById( 'content' )
);
