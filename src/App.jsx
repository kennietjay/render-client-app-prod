import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import EmailVerification from "./pages/EmailVerification";
import StaffSignup from "./pages/StaffSignup";
import FinancialKnowledge from "./pages/FinancialKnowledge";
import StaffSignin from "./pages/StaffSignin";
import UserPrivateRoute from "./components/PrivateRoute";
import StaffPrivateRoute from "./components/StaffPrivateRoute";
import Contacts from "./pages/Contacts";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import PrivacyTerms from "./pages/PrivacyTerms";
import EligibilityCheck from "./components/EligibilityCheck";

import { LoanProvider } from "./context/LoanContext";

import { CustomerProvider } from "./context/CustomerContext";
import { AuthProvider } from "./context/AuthContext";
import { StaffProvider } from "./context/StaffContext";
import { ContactProvider } from "./context/ContactContext";
import { AddressProvider } from "./context/AddressContext";
import { BankProvider } from "./context/BankContext";
import { EmployerProvider } from "./context/EmployerContext";
import { BusinessProvider } from "./context/BusinessContext";
import { GuarantorProvider } from "./context/GuarantorContext";
import { TransferProvider } from "./context/TransferContext";
import { TransactionProvider } from "./context/TransactionContext";

function App() {
  return (
    <>
      <ContactProvider>
        <AuthProvider>
          <LoanProvider>
            <TransactionProvider>
              <TransferProvider>
                <CustomerProvider>
                  <AddressProvider>
                    <BankProvider>
                      <EmployerProvider>
                        <BusinessProvider>
                          <GuarantorProvider>
                            <StaffProvider>
                              {/* <LoanProvider> */}
                              <Routes>
                                <Route path="/home" element={<Home />} />
                                <Route
                                  path="/"
                                  element={<Navigate to="/home" replace />}
                                />{" "}
                                <Route path="/about" element={<About />} />
                                <Route
                                  path="/services"
                                  element={<Services />}
                                />
                                <Route path="/contact" element={<Contacts />} />
                                <Route
                                  path="/user/signup"
                                  element={<Signup />}
                                />
                                <Route
                                  path="/user/signin"
                                  element={<Signin />}
                                />
                                <Route
                                  path="/staff/signup"
                                  element={<StaffSignup />}
                                />
                                <Route
                                  path="/staff/signin"
                                  element={<StaffSignin />}
                                />
                                <Route
                                  path="/home/careers"
                                  element={<Careers />}
                                />
                                <Route
                                  path="/services/privacy-terms"
                                  element={<PrivacyTerms />}
                                />
                                <Route
                                  path="/services/financial-knowledge"
                                  element={<FinancialKnowledge />}
                                />
                                <Route
                                  path="/services/eligibility-check"
                                  element={<EligibilityCheck />}
                                />
                                <Route
                                  path="/services/help-center"
                                  element={<HelpCenter />}
                                />
                                <Route
                                  path="/user/forgot-password"
                                  element={<ForgotPassword />}
                                />
                                <Route
                                  path="/user/signin/:id/verify/:token"
                                  element={<EmailVerification />}
                                />
                                <Route
                                  path="/user/reset-password/:token"
                                  element={<ResetPassword />}
                                />
                                <Route
                                  path="/user/profile"
                                  element={
                                    <UserPrivateRoute element={Profile} />
                                  }
                                />
                                <Route
                                  path="/staff/dashboard"
                                  element={
                                    <StaffPrivateRoute element={Dashboard} />
                                  }
                                />
                                <Route path="*" element={<PageNotFound />} />
                              </Routes>
                              {/* </LoanProvider> */}
                            </StaffProvider>
                          </GuarantorProvider>
                        </BusinessProvider>
                      </EmployerProvider>
                    </BankProvider>
                  </AddressProvider>
                </CustomerProvider>
              </TransferProvider>
            </TransactionProvider>
          </LoanProvider>
        </AuthProvider>
      </ContactProvider>
    </>
  );
}

export default App;
