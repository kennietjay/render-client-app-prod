export function categorizeLoans(loans) {
  const categories = {
    new: [], // Applied, Pending, Paying
    closed: [], // Cancel, Paid, Rejected
    active: [], // Approved and Paying, or Approved
  };

  loans?.forEach((loan) => {
    const { status } = loan;

    if (
      [
        "applied",
        "pending",
        "reviewing",
        "processing",
        "processed",
        "default",
      ].includes(status)
    ) {
      categories.new.push(loan);
    } else if (["cancel", "paid", "rejected", "closed"].includes(status)) {
      categories.closed.push(loan);
    } else if (status === "approved" || status === "paying") {
      categories.active.push(loan);
    }
  });

  return categories;
}
