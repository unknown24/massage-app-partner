// screen Scope
function handleClickOrder(e) {
  const result = doneOrder();
  readResult.bind(this)(result);
}


// up as Generic Screen Function
function readResult(result) {
  // determine result based on key
  if (result.currentScreen) {
    this.props.navigation.navigate(result.currentScreen);
  } else {
    this.setState({ ...this.state, ...result });
  }
}


// Public Scope
export const doneOrder = compose([
  requestSaveOrder,
  setScreenBasedOnHTTPResponse,
]);

// Private Scope
function setScreenBasedOnHTTPResponse(response, screen) {
  if (response.code == 200) {
    return { currentScreen: screen };
  }
  return {
    alertUI: {
      display: true,
      message: response.message,
    },
  };
}

function requestSaveOrder(params) {
  return fetch('urlRequest').then((res) => {
    try {
      return res.json();
    } catch (error) {
      return res.text();
    }
  });
}
