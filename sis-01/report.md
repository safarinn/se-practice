# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.3

## 1. Scenario

**Question:** How can software engineering reduce lifetime costs, and why does faster AI code generation not necessarily lower total cost?

**Users:** A cashier records sales, while a manager checks stock and plans purchases in a fictional small grocery store.

**Problem:** Manual sales and inventory records cause errors and require corrections.

**Constraints:** The store has a limited budget and a four-week launch deadline.

**Risk:** Incorrect inventory balances could lead to unnecessary purchases or shortages.

**Assumptions:** The store, roles, problems, budget limitation, deadline, and risk are fictional. Importable product records and an available scanner are provisional fictional assumptions, not confirmed facts. Scanner compatibility will be checked during initial setup, as a new fictional condition. No exact budget, savings figure, or recovery target is established.

## 2. Analysis

Software engineering should be evaluated across the system’s life: setup, development, training, operation, support, and changes. In this fictional store, the aim is reliable inventory information within four weeks. Engineering work has an initial cost, so safeguards should address purchasing mistakes rather than add complexity without a purpose.

The first decision is to agree on sales and stock rules with the cashier and manager, then limit the release to product records, sales, deliveries, cancellations, and returns. Loyalty features can wait. This reduces optional development work, while retaining operations that affect inventory. Excessive scope threatens the deadline; excessive reduction creates manual corrections after launch.

Compare custom development with configuring an existing POS over the same evaluation period. Include equipment, data cleaning, implementation hours, training, subscriptions, support, and later modifications. A ready product might fit four weeks, but restrictive customization or dependence on its supplier could increase future expense. Prices and effort estimates are missing, so neither alternative is proven cheaper.

The second decision is to commit the sale record and stock update together. PostgreSQL §3.4 explains transaction atomicity: grouped operations complete together or have no effect. This prevents partial database updates if implemented correctly. It does not validate the chosen product, quantity, or duplicate submission. Although PostgreSQL supplies the example evidence, a particular database has not been selected.

Scanner compatibility is checked at setup under the fictional condition. Barcode mappings still require validation, and unknown codes need a controlled fallback. Test specified results: ten units minus a sale of two gives eight; cancellation before completion leaves ten; repeated submission leaves eight. For returns, agree whether goods are resalable before deciding their stock effect. An interrupted transaction must not save only one operation. These targeted checks require effort but address the stated risk.

The manager should agree on tolerable data loss and recovery time, arrange separate backup storage, and validate restored records. AWS REL09-BP04 supports recovery testing; it does not require this store to adopt AWS. Recovery targets remain undecided.

Finally, assess AI through total generation, review, correction, testing, and maintenance effort. Fast output may save time or create extra work. A short employee guide and understandable code are proposed investments in support, not quantified savings. No cost measurements or operational tests have been performed.

## 3. Review

The review produced seven concerns. Concern 1 is accepted: listing costs is insufficient, so section 2 compares categories over the same evaluation period without invented prices. Concern 2 is accepted because the four-week deadline makes configuration of an existing POS worth considering. Neither option is assumed cheaper.

Concern 3 is accepted. Verification row 1 checks the original transaction claim against PostgreSQL §3.4. The source supports grouped operations completing together, not correct product selection. The claim is qualified, and change-log row 1 separates atomicity from validation. This is a substantive challenge to the implication that a transaction alone resolves inventory accuracy.

Concern 4 is qualified following the student’s objection: compatibility is checked at the beginning. This was absent from the original scenario and is now explicitly a fictional condition. It does not eliminate wrong barcode mappings or preparation costs, so those checks remain.

Concern 5 is accepted: section 2 gives expected stock outcomes and checks repeated submission. Return rules must distinguish resalable goods; a refund alone does not establish that stock should increase. Change-log row 2 records these changes rather than a wording adjustment.

Concern 6 is accepted. Verification row 2 checks the recovery claim against AWS REL09-BP04 and keeps it. The source supports testing restored data and recovery objectives. Change-log row 3 adds those requirements, while separate storage is identified as a proposed safeguard, not a source quotation.

Concern 7 is accepted: AI generation time excludes review and repair effort. No empirical savings claim is retained. The student confirmed reading both sources on 11 October. Sections 1–4 and the tables were assembled with AI assistance; they still require the student’s review. Reflection remains unwritten, so the checker’s reflection failure is reported rather than hidden.

## 4. Conclusion

I recommend first comparing a configurable POS with a small custom solution, then selecting the option that fits agreed inventory rules, the budget, and the four-week deadline. Whichever option is selected should handle essential stock events, validate barcode mappings, prevent duplicate processing, and demonstrate backup recovery before launch. These decisions focus effort on the risk of purchasing from incorrect balances.

The main limitation is missing evidence about actual costs and operation. Product prices, development estimates, data quality, and recovery targets are unknown, and no system has been tested. Therefore this report supports a method for making a decision, not a proven savings figure. AI can assist implementation and review, but the final judgment needs measured total effort and accountable human checking.

## 5. Reflection



Before this assignment, I thought that working code was the most important part of a system. Now I understand that a POS system also needs checks, backups, and clear rules for sales and stock.
The example with milk helped me understand duplicate sales. If a sale is recorded twice, the database can show fewer products than the store actually has. This creates differences during a stock check and makes reports less reliable.
I also learned that fast AI code generation does not always save time. The request should be clear, but even then the code needs checking and may need corrections.
Another lesson was about backups. Having a backup file is not enough if the data cannot be restored. Before launching a POS system, I would check recovery and make sure that cancelling an unfinished sale does not change stock.
I questioned the barcode concern because I expected barcodes to be assigned and checked before sales. However, this expectation needs to be stated clearly. I now understand that scanner compatibility and correct product mapping are different checks


## 6. References

- PostgreSQL Global Development Group. (n.d.). PostgreSQL 18 Documentation, §3.4, Transactions. https://www.postgresql.org/docs/18/tutorial-transactions.html Accessed 2026-10-11.
- Amazon Web Services. (n.d.). AWS Well-Architected Framework, REL09-BP04, Perform periodic recovery of the data to verify backup integrity and processes; Implementation guidance. https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_backing_up_data_periodic_recovery_testing_data.html Accessed 2026-10-11.

## 7. Appendix A — Initial outline

1. Create a database and manage inventory through a POS system to reduce errors.
2. Introduce barcodes for products.
3. Initially implement only sales and inventory tracking to stay within the budget.
4. Test calculations and inventory updates to reduce the cost of fixing errors.
5. Set up backups and prepare a user guide for employees.

Authorship disclosure: points 1–2 originated with the student in Russian and were translated with AI assistance. Points 3–5 were suggested by ChatGPT before Prompt A. This is not an entirely independent student outline. The student reported pushing the initial outline before Prompt A; the repository history has not been inspected here.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** 6.1 Sol
- **Date:** 2026-10-08
- **Purpose:** contextual draft


**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.3 — How can software engineering methods reduce costs over a system's life, and why does faster AI code generation not always mean lower total cost? for a first-year-level university assignment.

My scenario is a fictional small grocery store where a cashier and a manager need a POS system because manual sales and inventory records cause errors. The constraints are a limited budget and a four-week launch deadline. The main risk is incorrect inventory balances leading to purchasing mistakes. My initial ideas are 1) Create a database and manage inventory through a POS system to reduce errors; 2) Introduce barcodes for products; 3) Initially implement only sales and inventory tracking to stay within the budget; 4) Test calculations and inventory updates to reduce the cost of fixing errors; 5) Set up backups and prepare a user guide for employees. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Software engineering can reduce a system’s lifetime costs by helping developers build the right features, control errors, and prepare for maintenance. For the fictional grocery store, the goal is a dependable POS system that supports sales and accurate inventory within a limited budget and a four-week deadline. Success means considering development, training, operation, support, and future changes, rather than measuring only how quickly code is produced.

**Scenario assumptions.** The store, deadline, budget constraint, and inventory problems are fictional. This draft additionally assumes that existing product records can be imported and that a barcode scanner is available. These assumptions need confirmation before implementation. No financial savings or error-reduction percentages have been established.

**Requirements and scope.** The first engineering decision is to prioritize product records, sales, and inventory tracking. Loyalty programs and advanced analytics can wait. Before coding, the cashier and manager should agree on how completed sales, cancellations, returns, and stock deliveries affect quantities. This reduces ambiguity and the risk of building incorrect behavior. However, a small initial scope must still include essential safeguards; postponing every exception could create costly manual work after launch.

**Database and barcode design.** A database can organize product identifiers, prices, quantities, and sales records. Barcode scanning can reduce repeated manual product entry, but it cannot correct an incorrect barcode-to-product mapping. The system should display the selected product and price for confirmation and provide a controlled fallback for unreadable barcodes. A completed sale and its inventory update should be treated as one database transaction, so a failure does not leave only one operation recorded. This adds implementation work but directly addresses the risk of misleading inventory balances.

**Testing and maintenance.** The second engineering decision is to test high-risk behavior before adding optional features. Tests should cover quantity changes, totals, returns, unknown barcodes, and interrupted transactions. Testing requires time and cannot guarantee that all defects are absent. Nevertheless, these checks provide evidence about the cases most likely to cause purchasing mistakes. Clear code and a short employee guide also require effort now, but can make later troubleshooting and staff training easier.

**Backups and recovery.** Backups should be scheduled, with responsibility assigned to the manager. A recovery exercise is necessary because creating a backup does not demonstrate that it can be restored. Backup frequency involves a trade-off between operating effort and the amount of recent data the store could lose.

**AI and total cost.** AI may produce code quickly, but developers must still review its logic, integration, security, and maintainability. Faster generation could increase total cost if unsuitable code creates defects or support problems. Alternatively, reviewed AI assistance may save development time. Neither outcome should be assumed without measurement.

**Claims to verify.** Check authoritative sources on database transaction guarantees and backup restoration testing. Any claim that AI necessarily lowers lifetime cost also needs evidence; this scenario supports a conditional argument, not a proven savings estimate.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** 6.1 Sol
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How can software engineering methods reduce costs over a system's life, and why does faster AI code generation not always mean lower total cost? Scenario: A fictional small grocery store where a cashier and a manager need a POS system because manual sales and inventory records cause errors. The constraints are a limited budget and a four-week launch deadline. The main risk is incorrect inventory balances leading to purchasing mistakes. Draft: Software engineering can reduce a system’s lifetime costs by helping developers build the right features, control errors, and prepare for maintenance. For the fictional grocery store, the goal is a dependable POS system that supports sales and accurate inventory within a limited budget and a four-week deadline. Success means considering development, training, operation, support, and future changes, rather than measuring only how quickly code is produced.

**Scenario assumptions.** The store, deadline, budget constraint, and inventory problems are fictional. This draft additionally assumes that existing product records can be imported and that a barcode scanner is available. These assumptions need confirmation before implementation. No financial savings or error-reduction percentages have been established.

**Requirements and scope.** The first engineering decision is to prioritize product records, sales, and inventory tracking. Loyalty programs and advanced analytics can wait. Before coding, the cashier and manager should agree on how completed sales, cancellations, returns, and stock deliveries affect quantities. This reduces ambiguity and the risk of building incorrect behavior. However, a small initial scope must still include essential safeguards; postponing every exception could create costly manual work after launch.

**Database and barcode design.** A database can organize product identifiers, prices, quantities, and sales records. Barcode scanning can reduce repeated manual product entry, but it cannot correct an incorrect barcode-to-product mapping. The system should display the selected product and price for confirmation and provide a controlled fallback for unreadable barcodes. A completed sale and its inventory update should be treated as one database transaction, so a failure does not leave only one operation recorded. This adds implementation work but directly addresses the risk of misleading inventory balances.

**Testing and maintenance.** The second engineering decision is to test high-risk behavior before adding optional features. Tests should cover quantity changes, totals, returns, unknown barcodes, and interrupted transactions. Testing requires time and cannot guarantee that all defects are absent. Nevertheless, these checks provide evidence about the cases most likely to cause purchasing mistakes. Clear code and a short employee guide also require effort now, but can make later troubleshooting and staff training easier.

**Backups and recovery.** Backups should be scheduled, with responsibility assigned to the manager. A recovery exercise is necessary because creating a backup does not demonstrate that it can be restored. Backup frequency involves a trade-off between operating effort and the amount of recent data the store could lose.

**AI and total cost.** AI may produce code quickly, but developers must still review its logic, integration, security, and maintainability. Faster generation could increase total cost if unsuitable code creates defects or support problems. Alternatively, reviewed AI assistance may save development time. Neither outcome should be assumed without measurement.

**Claims to verify.** Check authoritative sources on database transaction guarantees and backup restoration testing. Any claim that AI necessarily lowers lifetime cost also needs evidence; this scenario supports a conditional argument, not a proven savings estimate.
```

**Response:**

```text
The draft addresses the question and connects engineering decisions to the store’s inventory risk. It avoids invented savings figures and labels additional assumptions. However, several arguments need clarification.

1. **Lifetime cost is described but not assessed.**  
   The draft lists development, training, operation, support, and future changes without explaining how to compare their costs. This matters because additional testing or documentation uses part of the limited budget. Check estimated implementation hours, recurring fees, staff training time, and the effort needed to correct inventory errors. A counterexample is an expensive testing setup whose maintenance costs exceed its benefits for a very small application.

2. **Custom development is assumed without considering an existing POS product.**  
   The draft moves directly toward implementation. Within four weeks, configuring an existing system might be more practical. Compare purchase or subscription costs, barcode support, data export, customization, and support arrangements. Alternatively, an existing product might require costly workarounds or create dependence on its supplier; buying is not automatically cheaper.

3. **The transaction claim needs a narrower interpretation.**  
   Recording a sale and updating inventory in one transaction can prevent partial database updates, provided both operations are correctly included. It does not prevent incorrect quantities, duplicate sales, or wrong product mappings. Verify transaction behavior in the chosen database’s official documentation and test an interrupted update. A counterexample is a transaction that successfully commits a sale for the wrong product: both records are consistent, but the inventory is still inaccurate.

4. **Barcode benefits depend on data quality and equipment.**  
   The assumed scanner availability and importable product records are not established by the scenario. Confirm scanner compatibility, inspect product records, and test unreadable and unknown barcodes. Include equipment and data-cleaning effort in the cost comparison. Scanning the wrong label can introduce an error faster than manual entry.

5. **Testing priorities need concrete expected outcomes.**  
   The proposed cases are relevant, but “test high-risk behavior” remains broad. Define expected results for a completed sale, a cancellation, a return, and an interrupted transaction. Review these rules with the cashier and manager. Also test repeated submission of the same sale. Passing a totals test is a counterexample to assuming inventory is correct: the price calculation could pass while stock decreases twice.

6. **Backup arrangements are incomplete.**  
   Scheduling backups and assigning responsibility do not specify storage location, acceptable data loss, or acceptable recovery time. Check authoritative recovery guidance and perform a restoration exercise. The manager’s ability to manage recovery is another assumption to confirm. A backup stored only on the POS computer could be lost together with the original database.

7. **The AI cost argument is reasonable but unmeasured.**  
   The draft correctly avoids claiming guaranteed savings. Strengthen the reasoning by comparing time spent generating, reviewing, correcting, testing, and maintaining AI-assisted code. Check any empirical claim against research that matches the task and developer context. A counterexample to “faster generation means lower total cost” is code produced quickly that requires extensive correction. Conversely, suitable code that passes review could reduce effort.

These concerns support a more precise cost argument; they do not establish that the proposed system will fail or that any alternative is necessarily cheaper.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** 6.1 Sol
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accept concerns 1, 2, 3, 5, 6, and 7. The revision should explain how to compare lifetime costs, consider an existing POS product as an alternative, clarify the limits of transactions, give concrete testing outcomes, define recovery requirements, and assess total AI-assisted effort rather than generation time alone. I qualify concern 4: scanner compatibility will be checked during initial setup, before implementation. This is a new fictional scenario assumption. Barcode-to-product mappings still need validation, and equipment and data preparation costs must be included.

Verified evidence: I read PostgreSQL 18 Documentation, section 3.4, Transactions: https://www.postgresql.org/docs/18/tutorial-transactions.html (accessed 2026-10-11). It explains that a transaction groups operations into an all-or-nothing operation. Decision: qualify the original claim because this protects against partial updates when both operations are correctly included, but does not establish that the product or quantity entered is correct. I also read AWS Well-Architected Framework, REL09-BP04, Perform periodic recovery of the data to verify backup integrity and processes: https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_backing_up_data_periodic_recovery_testing_data.html (accessed 2026-10-11). It recommends recovery tests, checking restored data, and assessing recovery time and acceptable data loss. Decision: keep the claim that creating a backup alone does not demonstrate recoverability. Apply the recovery principles to the fictional store without assuming that it uses AWS.

Draft: Software engineering can reduce a system’s lifetime costs by helping developers build the right features, control errors, and prepare for maintenance. For the fictional grocery store, the goal is a dependable POS system that supports sales and accurate inventory within a limited budget and a four-week deadline. Success means considering development, training, operation, support, and future changes, rather than measuring only how quickly code is produced.

**Scenario assumptions.** The store, deadline, budget constraint, and inventory problems are fictional. This draft additionally assumes that existing product records can be imported and that a barcode scanner is available. These assumptions need confirmation before implementation. No financial savings or error-reduction percentages have been established.

**Requirements and scope.** The first engineering decision is to prioritize product records, sales, and inventory tracking. Loyalty programs and advanced analytics can wait. Before coding, the cashier and manager should agree on how completed sales, cancellations, returns, and stock deliveries affect quantities. This reduces ambiguity and the risk of building incorrect behavior. However, a small initial scope must still include essential safeguards; postponing every exception could create costly manual work after launch.

**Database and barcode design.** A database can organize product identifiers, prices, quantities, and sales records. Barcode scanning can reduce repeated manual product entry, but it cannot correct an incorrect barcode-to-product mapping. The system should display the selected product and price for confirmation and provide a controlled fallback for unreadable barcodes. A completed sale and its inventory update should be treated as one database transaction, so a failure does not leave only one operation recorded. This adds implementation work but directly addresses the risk of misleading inventory balances.

**Testing and maintenance.** The second engineering decision is to test high-risk behavior before adding optional features. Tests should cover quantity changes, totals, returns, unknown barcodes, and interrupted transactions. Testing requires time and cannot guarantee that all defects are absent. Nevertheless, these checks provide evidence about the cases most likely to cause purchasing mistakes. Clear code and a short employee guide also require effort now, but can make later troubleshooting and staff training easier.

**Backups and recovery.** Backups should be scheduled, with responsibility assigned to the manager. A recovery exercise is necessary because creating a backup does not demonstrate that it can be restored. Backup frequency involves a trade-off between operating effort and the amount of recent data the store could lose.

**AI and total cost.** AI may produce code quickly, but developers must still review its logic, integration, security, and maintainability. Faster generation could increase total cost if unsuitable code creates defects or support problems. Alternatively, reviewed AI assistance may save development time. Neither outcome should be assumed without measurement.

**Claims to verify.** Check authoritative sources on database transaction guarantees and backup restoration testing. Any claim that AI necessarily lowers lifetime cost also needs evidence; this scenario supports a conditional argument, not a proven savings estimate.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
**Revised draft**

Software engineering can reduce lifetime costs by limiting unnecessary work, checking important behavior, and preparing for operation and maintenance. For this fictional grocery store, the objective is dependable sales and inventory tracking within a limited budget and four weeks. Faster code generation alone does not establish that this objective will be achieved cheaply.

**Scope and cost comparison.** The first decision is to prioritize product records, sales, stock deliveries, cancellations, and returns, while postponing loyalty features and advanced analytics. The cashier and manager should agree on inventory rules before implementation. A smaller scope limits development work, but removing essential operations could create manual corrections after launch.

Before choosing custom development, compare it with configuring an existing POS product. Use the same evaluation period for both options and include setup, equipment, data preparation, training, recurring fees, support, and future changes. An existing product might fit the deadline better, but customization restrictions or supplier dependence could increase later costs. No option can be declared cheaper without estimates.

**Data integrity and testing.** Scanner compatibility will be checked during initial setup; this is a new fictional assumption. Product records must still be checked for correct barcode mappings. An unreadable or unknown barcode should trigger a controlled fallback rather than silently selecting a product.

The second decision is to record a sale and its inventory update in one transaction. PostgreSQL’s documentation explains that transactions group operations into an all-or-nothing unit. This supports protection against partial updates when both operations are included correctly; it does not establish that the entered product or quantity is correct (PostgreSQL, §3.4).

Tests should therefore have explicit outcomes. Starting with ten units, selling two should leave eight. Cancelling before completion should leave ten. Resubmitting the same completed sale should not reduce stock again. An interrupted transaction should not leave only one database operation recorded. These tests require implementation effort and cannot prove the absence of every defect, but address the identified inventory risk.

**Recovery and AI assistance.** The manager should agree on acceptable data loss and recovery time, select backup storage separate from the POS computer, and arrange a restoration test. AWS guidance recommends checking restored data and measuring recovery against recovery objectives. These principles can inform the store’s plan without requiring AWS services (AWS, REL09-BP04).

AI assistance should be assessed through total generation, review, correction, testing, and maintenance effort. Quickly produced code may save time or introduce additional work. Clear code and an employee guide also consume initial effort, so their expected support benefits must be weighed against the budget.

**What changed and why**

1. Added a comparison with an existing POS product and a consistent cost evaluation period, addressing concerns 1 and 2.
2. Narrowed the transaction claim using PostgreSQL evidence: atomic updates do not guarantee correct input.
3. Recorded early scanner compatibility checking as a fictional assumption while retaining barcode mapping validation.
4. Replaced broad testing advice with concrete expected outcomes, including repeated sale submission.
5. Added recovery objectives, separate backup storage, and restoration validation. The supplied AWS source supports recovery testing; separate storage is a proposed scenario safeguard.
6. Expanded the AI assessment from generation speed to total effort, without claiming measured savings.

**Remaining gaps**

The budget amount, evaluation period, available POS products, equipment costs, product data quality, recovery targets, and implementation estimates remain unknown. No tests, recovery exercises, or cost measurements have been performed. The sources support technical principles, not a quantified reduction in the store’s lifetime costs.
```

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| A completed sale and its inventory update should be treated as one database transaction, so a failure does not leave only one operation recorded. | PostgreSQL 18 Documentation, §3.4, Transactions. https://www.postgresql.org/docs/18/tutorial-transactions.html Accessed 2026-10-11. | Operations grouped in a transaction have an all-or-nothing effect. Correct grouping is needed; correct input and duplicate handling remain separate application requirements. | qualify |
| A recovery exercise is necessary because creating a backup does not demonstrate that it can be restored. | AWS Well-Architected Framework, REL09-BP04, Implementation guidance. https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_backing_up_data_periodic_recovery_testing_data.html Accessed 2026-10-11. | Recovery tests check whether restored data is usable and whether recovery time and data loss meet agreed objectives. | keep |

### Change log

<!-- Final versions below were drafted with AI assistance and require student review; they are not claimed as unaided student edits. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| This supports protection against partial updates when both operations are included correctly; it does not establish that the entered product or quantity is correct (PostgreSQL, §3.4). | This prevents partial database updates if implemented correctly. It does not validate the chosen product, quantity, or duplicate submission. | PostgreSQL §3.4 supports atomicity. Explicit duplicate handling addresses the inventory risk separately from transaction guarantees. |
| Cancelling before completion should leave ten. Resubmitting the same completed sale should not reduce stock again. | Test specified results: ten units minus a sale of two gives eight; cancellation before completion leaves ten; repeated submission leaves eight. For returns, agree whether goods are resalable before deciding their stock effect. | Concerns 3 and 5 require explicit outcomes. Returning damaged goods must not automatically increase sellable stock; this is a proposed rule to agree with users. |
| The manager should agree on acceptable data loss and recovery time, select backup storage separate from the POS computer, and arrange a restoration test. | The manager should agree on tolerable data loss and recovery time, arrange separate backup storage, and validate restored records. Recovery targets remain undecided. | AWS REL09-BP04 supports validation and recovery objectives; the scenario supplies no numeric targets. Separate storage is proposed, not quoted from this source. |

