import * as React from 'react'
import {Dimmer, Header, Icon} from "semantic-ui-react";
import Auth from "../Auth/Auth";

interface NotFoundProps {
    auth: Auth
}

interface NotFoundState {
}

export class NotFound extends React.PureComponent<NotFoundProps, NotFoundState> {
    state: NotFoundState = {}
    render() {
        return (<Dimmer active page>
            <Header as='h2' icon inverted>
                <Icon name='space shuttle'/>
                Gnarly!
                <Header.Subheader>You have travelled beyond the limits of this site!</Header.Subheader>
            </Header>
        </Dimmer>)
    }
}
