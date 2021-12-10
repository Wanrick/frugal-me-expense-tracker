import React from "react";
import {Expense} from "../Types/Expense";
import {Button, GridRow, Icon, Item, Label, Message} from 'semantic-ui-react'
import ExpenseInvoiceImage from "./ExpenseInvoiceImage";
import {deleteExpense} from "../API/ExpenseTrackerAPI";
import Auth from "../Auth/Auth";


interface EditExpenseProps {
    expenses: Expense[]
    onUpdateClicked: (expenseId: string) => void
    onUploadClick: (expenseId: string) => void
    auth: Auth
}

interface EditExpenseState {
    expenses: Expense[]
}

export class ExpenseListItemFragment extends React.PureComponent<EditExpenseProps, EditExpenseState> {
    state: EditExpenseState = {
        expenses: this.props.expenses
    }

    private getExpenseImage(expense: Expense) {
        let imageUrl = 'https://react.semantic-ui.com/images/wireframe/image.png';

        if (expense && expense.invoiceUrl && expense.invoiceUrl.length > 5) {
            imageUrl = expense.invoiceUrl
        }

        return <ExpenseInvoiceImage imageUrl={imageUrl} expenseId={expense.expenseId}
                                    onUploadClick={this.props.onUploadClick}/>
    }

    onExpenseDelete = async (expenseId: string) => {
        try {
            await deleteExpense(this.props.auth.getIdToken(), expenseId)
            this.setState({
                expenses: this.state.expenses.filter(expense => expense.expenseId !== expenseId)
            })
        } catch {
            alert('Expense deletion failed')
        }
    }

    render() {
        return (
            <GridRow>
                <Item.Group relaxed>
                    {this.state.expenses.map((expense, pos) => {
                        return (
                            <Item key={pos}>
                                <Item.Image>
                                    {this.getExpenseImage(expense)}
                                </Item.Image>

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</Item.Header>
                                    <Item.Content>
                                        <Label.Group tag>
                                            <Label color='teal'>{'€' + expense.amount + '.00'}</Label>
                                        </Label.Group>
                                        <Message size='small' color='teal'>
                                            <p>{expense.description}</p>
                                        </Message>
                                    </Item.Content>
                                    <Item.Extra>
                                        <Button floated='right' size='tiny' basic color='red' icon
                                                onClick={() => this.onExpenseDelete(expense.expenseId)}>
                                            <Icon name='trash alternate outline' color='red'/>
                                        </Button>
                                        <Button primary floated='right' size='tiny'
                                                onClick={() => this.props.onUpdateClicked(expense.expenseId)}>
                                            Update Expense
                                        </Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        )
                    })}
                </Item.Group>
            </GridRow>
        )
    }
}