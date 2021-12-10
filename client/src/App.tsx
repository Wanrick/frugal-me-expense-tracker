import React, {Component} from 'react';
import './App.scss';
import {Button, Container, Grid, GridRow, Icon, Label, Menu, Segment} from "semantic-ui-react"
import Auth from "./Auth/Auth";
import {Link, Route, Router, Switch} from "react-router-dom";
import {NotFound} from "./Components/NotFound";
import {ExpensesList} from "./Components/ExpensesList";
import {InvoiceUpload} from "./Components/InvoiceUpload";
import {ExpenseEdit} from "./Components/ExpenseEdit";

export interface AppProps {
}

export interface AppProps {
    auth: Auth
    history: any
}

export interface AppState {
}

export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogin() {
        this.props.auth.login()
    }

    handleLogout() {
        this.props.auth.logout()
    }

    render() {
        return (
            <div>
                <Segment style={{padding: '4em 0em'}} vertical>
                    <Grid container divided={"vertically"} verticalAlign="middle">
                        <GridRow>
                            {this.generateMenu()}
                        </GridRow>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Router history={this.props.history}>
                                    {this.generateCurrentPage()}
                                </Router>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }

    generateMenu() {
        return (
            <Container>
                <Button as={Link} to="/"><Icon name='home'/></Button>
                {this.getLoginIcon()}
            </Container>
        )
    }

    logInLogOutButton() {
        if (this.props.auth.isAuthenticated()) {
            return (
                <Menu.Item name="logout" onClick={this.handleLogout} style={{fontWeight: 'bold'}}>
                    Log Out
                </Menu.Item>
            )
        } else {
            return (
                <Menu.Item name="login" onClick={this.handleLogin} style={{fontWeight: 'bold'}}>
                    Log In
                </Menu.Item>
            )
        }
    }

    generateCurrentPage() {
        if (!this.props.auth.isAuthenticated()) {
            return <div>
                <h1>Please log in</h1>
            </div>
        }

        return (
            <Switch>
                <Route
                    path="/"
                    exact
                    render={props => {
                        return <ExpensesList {...props} auth={this.props.auth}/>
                    }}
                />

                <Route
                    path="/expenses/:expenseId/upload"
                    exact
                    render={props => {
                        return <InvoiceUpload {...props} auth={this.props.auth}/>
                    }}
                />

                <Route
                    path="/expenses/:expenseId/edit"
                    exact
                    render={props => {
                        return <ExpenseEdit {...props} auth={this.props.auth}/>
                    }}
                />

                <Route
                    path="*"
                    render={props => {
                        return <NotFound {...props} auth={this.props.auth}/>
                    }}
                />
            </Switch>
        )
    }

    private getLoginIcon() {
        return this.props.auth.isAuthenticated() ?
            (<Button as='div' labelPosition='right'>
                <Button icon disabled>
                    <Icon name='user'/>
                    Logout
                </Button>
                <Label as='a' basic pointing='left'>
                    <Icon name='lock open' onClick={this.handleLogout}/>
                </Label>
            </Button>)
            :
            (<Button as='div' labelPosition='right'>
                <Button icon disabled>
                    <Icon name='user'/>
                    Login
                </Button>
                <Label as='a' basic pointing='left'>
                    <Icon name='lock' onClick={this.handleLogin}/>
                </Label>
            </Button>);
    }
}