export interface Expense {
	userId: string;
	expenseId: string;
	createdAt: string;
	description: string;
	category: string;
	amount: number;
	currency: string;
	invoiceUrl?: string;
}
