"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Expense {
  id: string;
  createdAt: string;
  payer: string;
  expenseType: string;
  amount: number;
  otherType?: string;
  currency: string;
  isPaid: boolean;
  invoice: string;
}

interface TotalAmount {
  currency: string;
  totalAmount: number;
}

interface ExpensesData {
  expenses: Expense[];
  totalAmount: TotalAmount[];
}

interface ExpensesDownloaderProps {
  expenses: ExpensesData;
  name: string;
  date: string;
}

const ExpensesDownloader: React.FC<ExpensesDownloaderProps> = ({
  expenses,
  name,
  date,
}) => {
  const fullExpensesData = expenses?.expenses || [];

  const downloadExcel = () => {
    // Type assertion for fullExpensesData
    const processedData = fullExpensesData.map((expense: Expense) => ({
      "Payment Date": new Date(expense.createdAt).toDateString(),
      invoice: expense.invoice,
      Recipient: expense.payer,
      "Expense Type":
        expense.expenseType +
        (expense.otherType ? ` - ${expense.otherType}` : ""),
      Amount: expense.amount,
      Currency: expense.currency,
      "Payment Status": expense.isPaid ? "Paid" : "Unpaid",
    }));

    // Create the worksheet
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Payment Date
      { wch: 20 }, // Recipient
      { wch: 20 }, // Recipient
      { wch: 25 }, // Expense Type
      { wch: 10 }, // Amount
      { wch: 10 }, // Currency
      { wch: 12 }, // Payment Status
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Type assertion for expenses
    const summaryData = (expenses as ExpensesData)?.totalAmount.map(
      (total) => ({
        Currency: total.currency.toUpperCase(),
        "Total Amount": total.totalAmount,
      }),
    );

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    // Set summary sheet column widths
    summarySheet["!cols"] = [
      { wch: 10 }, // Currency
      { wch: 15 }, // Total Amount
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Total Amounts");

    XLSX.writeFile(workbook, `${name} Expenses ${date}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(12);
    doc.text(`${name} Expenses`, 14, 20);

    const headers = [
      "Payment Date",
      "Invoice",

      "Recipient",
      "Expense Type",
      "Amount",
      "Currency",
      "Payment Status",
    ];

    const tableData = fullExpensesData.map((expense: any) => [
      new Date(expense.createdAt).toDateString(),
      expense.invoice,
      expense.payer,
      expense.expenseType +
        (expense.otherType ? ` - ${expense.otherType}` : ""),
      expense.amount.toString(),
      expense.currency,
      expense.isPaid ? "Paid" : "Unpaid",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    const summaryY = (doc as any).previousAutoTable.finalY + 10;
    // doc.text("Total Amount Summary:", 14, summaryY);

    const summaryText = expenses?.totalAmount
      .map((total) => `${total.currency.toUpperCase()} - ${total.totalAmount}`)
      .join(", ");

    doc.text(summaryText, 14, summaryY + 10);

    doc.save(`${name} Expenses ${date}.pdf`);
  };

  return (
    <div className="justift-end w-fll flex space-x-2">
      <Button onClick={downloadExcel} variant="outline">
        Download Excel
      </Button>
      <Button onClick={downloadPDF} variant="outline">
        Download PDF
      </Button>
    </div>
  );
};

export default ExpensesDownloader;
