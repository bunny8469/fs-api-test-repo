export enum TransactionType {
  EXPENSE = "EXPENSE",
  CREDIT = "CREDIT",
}

export enum GroupType {
  CATEGORY = "CATEGORY",
  BUDGET = "BUDGET",
}

export enum RecurringType {
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  ANNUALLY = "ANNUALLY",
}

export interface Transaction {
  id: string;                       // Unique identifier (e.g., from timestamp hash)
  amount: number;                   // Amount of money involved
  type: TransactionType;            // CREDIT or EXPENSE
  planned: boolean;
  date: Date;                       // When it occurred
  category: string;                 // e.g., "Food", "Bills", etc.
  sendEntity?: string;              // Optional: who sent the money
  receiveEntity?: string;           // Optional: who received the money
  note?: string;                    // Optional: description or memo
  group?: string;
  recurringPeriod?: RecurringType;
}

export interface VisualMeta {
  icon?: string;
  colorHex?: string;
  backgroundColorHex?: string;
  emoji?: string;
}

export interface TransactionGroup {
  transactions: string[];
  groupName: string;
  groupIcon?: string;
  createdAt?: Date;
  groupType?: GroupType;
  notes?: string;
  visualMeta?: VisualMeta;
  subGroups?: string[];
}