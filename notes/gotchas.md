# Gotcha!

don't let it be you


## State updates may be asynchronous

https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous

If the next state depends on props, we should lazy eval.

```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});

// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));

```

## Class member binding

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields

```
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  handleClick = () => {
    console.log('this is:', this);
  };
  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}

```

