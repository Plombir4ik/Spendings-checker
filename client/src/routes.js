import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CategoriesPage } from "./pages/CategoriesPage/CategoriesPage";
import { EditCategoryPage } from "./pages/EditCategoryPage/EditCategoryPage";
import { TransactionsPage } from "./pages/TransactionsPage/TransactionsPage";
import { EditTransactionPage } from "./pages/EditTransactionPage/EditTransactionPage";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";
import { ReportsLinePage } from "./pages/ReportsLinePage/ReportsLinePage";
import { ReportsPiePage } from "./pages/ReportsPiePage/ReportsPiePage";
import { AuthPage } from "./pages/AuthPage/AuthPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/categories/" exact element={<CategoriesPage />} />
        <Route path="/categories/create" element={<EditCategoryPage />} />
        <Route path="/categories/:id" element={<EditCategoryPage />} />

        <Route path="/transactions" exact element={<TransactionsPage />} />
        <Route
          path="/transactions/create"
          exact
          element={<EditTransactionPage />}
        />
        <Route
          path="/transactions/:id"
          exact
          element={<EditTransactionPage />}
        />

        <Route path="/reports" exact element={<ReportsPage />} />
        <Route path="/reports/line/:id" exact element={<ReportsLinePage />} />
        <Route path="/reports/pie/:id" exact element={<ReportsPiePage />} />

        <Route path="*" element={<Navigate to="/categories" />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" exact element={<AuthPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
};
