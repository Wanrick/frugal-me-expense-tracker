import React from "react";
import {Button, Dimmer, Image} from "semantic-ui-react";

interface ExpenseImageProps {
    imageUrl: string
    expenseId: string
    onUploadClick: (expenseId: string) => void
}

interface ExpenseImageState {
    active: boolean
}

export default class ExpenseInvoiceImage extends React.PureComponent<ExpenseImageProps, ExpenseImageState> {
    constructor(props: ExpenseImageProps) {
        super(props);
        this.state = {active: false}
    }

    handleShow = () => this.setState({active: true})
    handleHide = () => this.setState({active: false})

    render() {
        const {active} = this.state
        const content = (
            <div>
                <Button color={'green'} icon={'upload'} onClick={() => this.props.onUploadClick(this.props.expenseId)}/>
            </div>
        )

        return (
            <Dimmer.Dimmable
                as={Image}
                dimmed={active}
                dimmer={{active, content}}
                onMouseEnter={this.handleShow}
                onMouseLeave={this.handleHide}
                size='medium'
                src={this.props.imageUrl}
            />
        )
    }
}