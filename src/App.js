import React from 'react';
import './App.scss';
import HomePage from './pages/homepage/HomePage';
import { Route, Switch, Redirect } from 'react-router-dom';
import ShopPage from './pages/shop/Shop';
import Header from './components/header/Header';
import SigninAndSignup from './pages/signin-&-signup/signin-&-signup';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';
import CheckoutPage from './pages/checkout/checkout';
import AboutPage from './pages/about/about';
import { selectCurrentUser } from './redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';


class App extends React.Component {
  unsubscribeFromAuth = null ;

  componentDidMount(){
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth){
        const userRef = await createUserProfileDocument(userAuth);
        
        userRef.onSnapshot(snapShot => {
          setCurrentUser({
                id: snapShot.id,
                ...snapShot.data()
              });
        });
    }
    setCurrentUser(userAuth);
    });
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth();
  }
  
  render(){
    return (
      <div>
      <Header/>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/about' component={AboutPage} />
          <Route exact path='/checkout' component={CheckoutPage} />
          <Route exact path='/signin'
            render={() => 
            this.props.currentUser ? (
              <Redirect to='/'/>
            ) : (
              <SigninAndSignup/>
            )}
          />
        </Switch>
      </div>
  );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})
 
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
  )(App) ;
