import { LeadRepository as LeadDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Lead/LeadRepository";
import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";
import { CustomerRepository as CustomerDao } from "codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";

import { Controller, Get, Post, response } from "sdk/http";

@Controller
class GenerateGoodsReceiptService {

    private readonly leadDao;
    private readonly opportunityDao;
    private readonly customerDao;

    constructor() {
        this.leadDao = new LeadDao();
        this.opportunityDao = new OpportunityDao();
        this.customerDao = new CustomerDao();
    }

    @Get("/leadData/:leadId")
    public leadData(_: any, ctx: any) {
        const leadId = ctx.pathParameters.leadId;

        let lead = this.leadDao.findById(leadId);

        return lead;
    }

    @Post("/opportunityFromLead")
    public createOpportunityFromLead(body: any) {
        try {
            ["Name", "Address", "PostalCode", "Email", "Phone", "Fax", "Country", "City", "TIN", "IBAN"].forEach(elem => {
                if (!body.CustomerBody.hasOwnProperty(elem)) {
                    response.setStatus(response.BAD_REQUEST);
                    return;
                }
            })

            const newCustomer = this.customerDao.create(body.CustomerBody);

            if (!newCustomer) {
                response.setStatus(500);
                return { message: "Failed to create Customer!" };
            }

            try {
                ["Source", "Amount", "Lead", "Owner", "Type", "Priority", "Probability", "Status", "Currency", "Date"].forEach(elem => {
                    if (!body.OpportunityBody.hasOwnProperty(elem)) {
                        response.setStatus(response.BAD_REQUEST);
                        return;
                    }
                })

                let opportunityBody = body.OpportunityBody;

                opportunityBody["Customer"] = newCustomer;

                const newOpportunity = this.opportunityDao.create(opportunityBody);

                if (!newOpportunity) {
                    response.setStatus(500);
                    return { message: "Failed to create Opportunity!" };
                }

                response.setStatus(response.CREATED);
                return {
                    CustomerId: newCustomer,
                    OpportunityId: newOpportunity
                };

            } catch (e: any) {
                response.setStatus(response.BAD_REQUEST);
                return { error: e.message };
            }
        } catch (e: any) {
            response.setStatus(response.BAD_REQUEST);
            return { error: e.message };
        }
    }
}