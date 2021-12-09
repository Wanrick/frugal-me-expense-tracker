import {History} from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {Button, Dimmer, Form, Grid, GridRow, Header, Icon, Input, Item, Label, Loader} from 'semantic-ui-react'

import {createExpense, deleteExpense, getExpenses, patchExpense} from '../API/ExpenseTrackerAPI'
import Auth from '../Auth/Auth'
import {Expense} from "../Types/Expense";
import {Categories} from "../Types/ExpenseCategories";

interface ExpensesProps {
    auth: Auth
    history: History
}

interface ExpensesState {
    expenses: Expense[]
    newExpenseDescription: string
    newExpenseCategory: string
    newExpenseAmount: number
    loadingExpenses: boolean
    imageHoverActive: boolean
}


export class ExpensesList extends React.PureComponent<ExpensesProps, ExpensesState> {
    state: ExpensesState = {
        expenses: [],
        newExpenseDescription: '',
        newExpenseCategory: '',
        newExpenseAmount: 0,
        loadingExpenses: true,
        imageHoverActive: false
    }

    handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newExpenseDescription: event.target.value})
    }

    handleCategoryChange = (event: React.SyntheticEvent<HTMLInputElement, Event>, value: string | undefined) => {
        if (value != undefined) {
            this.setState({newExpenseCategory: value})
        }
    }

    handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newExpenseAmount: parseInt(event.target.value)})
    }

    onUploadClick = (expenseId: string) => {
        this.props.history.push(`/expenses/${expenseId}/upload`)
    }

    onExpenseCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const newExpense = await createExpense(this.props.auth.getIdToken(), {
                description: this.state.newExpenseDescription,
                category: this.state.newExpenseCategory,
                amount: this.state.newExpenseAmount
            })
            this.setState({
                expenses: [...this.state.expenses, newExpense],
                newExpenseDescription: '',
                newExpenseCategory: '',
                newExpenseAmount: 0,
            })
        } catch {
            alert('Expense creation failed')
        }
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

    onExpenseUpdate = async (pos: number) => {
        try {
            const expense = this.state.expenses[pos]
            await patchExpense(this.props.auth.getIdToken(), expense.expenseId, {
                category: this.state.newExpenseCategory,
                amount: this.state.newExpenseAmount
            })
            this.setState({
                expenses: update(this.state.expenses, {
                    [pos]: {
                        category: {$set: this.state.newExpenseCategory},
                        amount: {$set: this.state.newExpenseAmount}
                    }
                })
            })
        } catch {
            alert('Expense update failed')
        }
    }

    async componentDidMount() {
        try {
            const expenses = await getExpenses(this.props.auth.getIdToken())
            this.setState({
                expenses,
                loadingExpenses: false
            })
        } catch (e: any) {
            alert(`Failed to fetch expenses: ${e.message}`)
            this.setState({
                expenses: [{
                    expenseId: "TESTESTEST",
                    description: 'My Test Expense',
                    currency: 'EUR',
                    amount: 50,
                    category: 'saving',
                    userId: "USERUSERUSER",
                    createdAt: new Date().toString()
                }], //TODO
                loadingExpenses: false
            })
        }
    }

    render() {
        return (
            <div>
                <Header as='h1'>Expenses</Header>

                {this.renderCreateExpenseInput()}

                {this.renderExpenses()}
            </div>
        )
    }

    renderCreateExpenseInput() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='Description' placeholder='Description'
                                        onChange={this.handleDescriptionChange}/>
                            <Form.Select
                                fluid
                                label='Category'
                                placeholder='Category'
                                options={Categories}
                                onChange={(e: any, {value}) => this.handleCategoryChange(e, value?.toString())}
                            />
                            <Form.Field>
                                <label>Enter Amount</label>
                                <Input labelPosition='right' type='text' placeholder='Amount'
                                       onChange={this.handleAmountChange}>
                                    <Label basic>€</Label>
                                    <input/>
                                    <Label>.00</Label>
                                </Input>
                            </Form.Field>
                        </Form.Group>
                        <Button.Group>
                            <Button>Cancel</Button>
                            <Button.Or/>
                            <Button primary onClick={this.onExpenseCreate}>Add Expense</Button>
                        </Button.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderExpenses() {
        if (this.state.loadingExpenses) {
            return this.renderLoading()
        }
        if (!this.state.expenses || this.state.expenses.length == 0) {
            return (
                <div>
                    <h3>No Expenses Found</h3>
                </div>
            )
        }
        return this.renderExpensesList()
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline='centered'>
                    Loading Expenses
                </Loader>
            </Grid.Row>
        )
    }


    renderExpensesList() {
        return (
            <GridRow>
                <Item.Group relaxed>
                    {this.state.expenses.map((expense, pos) => {
                        return (
                            <Item key={pos}>
                                <Dimmer.Dimmable as={Item.Image} dimmed={this.state.imageHoverActive}>
                                    {this.getExpenseImage(expense)}
                                    <Dimmer active={this.state.imageHoverActive}
                                            onClick={() => this.onUploadClick(expense.expenseId)}>
                                        <Icon name='upload'/>
                                        Upload Receipt/Invoice
                                    </Dimmer>
                                </Dimmer.Dimmable>

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>{expense.currency} {expense.amount}</Item.Header>
                                    <Item.Content>
                                        <span>{expense.description}</span>
                                    </Item.Content>
                                    <Item.Content>
                                        <span>{expense.category}</span>
                                    </Item.Content>
                                    <Item.Extra>
                                        <Button primary floated='right'
                                                onClick={() => this.onUploadClick(expense.expenseId)}>Upload Image</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        )
                    })}
                </Item.Group>
            </GridRow>
        )
    }

    private getExpenseImage(expense: Expense) {
        if (expense && expense.invoiceUrl && expense.invoiceUrl.length > 5) {
            return <Item.Image size='small'
                        src={expense.invoiceUrl}
                        onMouseEnter={() => this.setState({imageHoverActive: true})}
                        onMouseLeave={() => this.setState({imageHoverActive: false})}/>
        } else {
            return <Item.Image size='small'
                               src='https://react.semantic-ui.com/images/wireframe/image.png'
                               onMouseEnter={() => this.setState({imageHoverActive: true})}
                               onMouseLeave={() => this.setState({imageHoverActive: false})}/>
        }
    }
}
