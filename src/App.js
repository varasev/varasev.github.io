import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Header, Ballots, NewBallot, Settings, Footer } from './components';
import './assets/App.css';
//import DevTools from 'mobx-react-devtools'
import Loading from './Loading';
import { inject, observer } from 'mobx-react';

@inject("commonStore", "contractsStore")
@observer
class App extends Component {
  onBallotsRender = () => {
    return <Ballots isActiveFilter={false}/>;
  }

  onActiveBallotsRender = () => {
    return <Ballots isActiveFilter={true}/>;
  }

  onToFinalizeBallotsRender = () => {
    return <Ballots isToFinalizeFilter={true}/>;
  }

  onNewBallotRender = () => {
    return <NewBallot/>;
  }

  onSettingsRender = () => {
    return <Settings/>;
  }

  onSearch = (e) => {
    const { commonStore } = this.props;
    commonStore.setSearchTerm(e.target.value.toLowerCase());
  }

  shouldShowNavPan = () => {
    const { commonStore } = this.props;
    const currentPath = this.props.location.pathname;
    let showNavPan =
    currentPath === `${commonStore.rootPath}`
    || currentPath === "/"
    || currentPath === `${commonStore.rootPath}/`
    || currentPath === `${commonStore.rootPath}/active`
    || currentPath === `${commonStore.rootPath}/tofinalize`;
    return showNavPan;
  }

  render() {
    const { commonStore, contractsStore } = this.props;
    const loading = commonStore.loading ? <Loading netId={contractsStore.netId} /> : ''
    const nav = this.shouldShowNavPan() ? <div className="search">
      <div className="container flex-container">
        <div className="nav">
        <NavLink className="nav-i" exact activeClassName="nav-i_active" to={`${commonStore.rootPath}/`}>All</NavLink>
        <NavLink className="nav-i" activeClassName="nav-i_active" to={`${commonStore.rootPath}/active`}>Active</NavLink>
        <NavLink className="nav-i" activeClassName="nav-i_active" to={`${commonStore.rootPath}/tofinalize`}>To finalize</NavLink>
        </div>
        <input type="search" className="search-input" onChange={this.onSearch}/>
      </div>
    </div> : null;
    return (
      <div>
        {loading}
        <Header netId={contractsStore.netId} />
        {nav}
        <Route exact path={`/`} render={this.onBallotsRender}/>
        <Route exact path={`${commonStore.rootPath}/`} render={this.onBallotsRender}/>
        <Route exact path={`${commonStore.rootPath}/active`} render={this.onActiveBallotsRender}/>
        <Route exact path={`${commonStore.rootPath}/tofinalize`} render={this.onToFinalizeBallotsRender}/>
        <Route path={`${commonStore.rootPath}/new`} render={this.onNewBallotRender}/>
        {/*<Route path={`${commonStore.rootPath}/settings`} render={this.onSettingsRender}/>*/}
        <Footer netId={contractsStore.netId} />
      </div>
    );
  }
}

export default App;
