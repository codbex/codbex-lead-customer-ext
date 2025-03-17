import { LeadRepository as LeadDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Lead/LeadRepository";
import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";
import { CustomerRepository as CustomerDao } from "codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { OpportunityPriorityRepository as OpportunityPriorityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Settings/OpportunityPriorityRepository";
import { OpportunityProbabilityRepository as OpportunityProbabilityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Settings/OpportunityProbabilityRepository";
import { OpportunityTypeRepository as OpportunityTypeDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Settings/OpportunityTypeRepository";
import { CurrencyRepository as CurrencyDao } from "codbex-currencies/gen/codbex-currencies/dao/Currencies/CurrencyRepository";


import { Controller, Get, Post, response } from "sdk/http";

@Controller
class GenerateGoodsReceiptService {

    private readonly leadDao;
    private readonly opportunityDao;
    private readonly customerDao;
    private readonly opportunityPriorityDao;
    private readonly opportunityProbabilityDao;
    private readonly opportunityTypeDao;
    private readonly currencyDao;

    constructor() {
        this.leadDao = new LeadDao();
        this.opportunityDao = new OpportunityDao();
        this.customerDao = new CustomerDao();
        this.opportunityPriorityDao = new OpportunityPriorityDao();
        this.opportunityProbabilityDao = new OpportunityProbabilityDao();
        this.opportunityTypeDao = new OpportunityTypeDao();
        this.currencyDao = new CurrencyDao();
    }

    @Get("/leadData/:leadId")
    public leadData(_: any, ctx: any) {
        const leadId = ctx.pathParameters.leadId;

        let lead = this.leadDao.findById(leadId);

        return lead;
    }

    @Get("/dropdownData")
    public dropdownData() {
        const opportunityPriorities = this.opportunityPriorityDao.findAll();
        const opportunityProbabilities = this.opportunityProbabilityDao.findAll();
        const opportunityTypes = this.opportunityTypeDao.findAll();
        const currencies = this.currencyDao.findAll();

        const body = {
            OpportunityPriorities: opportunityPriorities,
            OpportunityProbabilities: opportunityProbabilities,
            OpportunityTypes: opportunityTypes,
            Currencies: currencies
        }

        return body;
    }

    @Post("/opportunityFromLead")
    public createOpportunityFromLead(body: any) {
        try {
            ["CompanyName", "Email", "Phone", "Country", "City"].forEach(elem => {
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
                ["Name", "Designation", "Email", "Phone"].forEach(elem => {
                    if (!body.CustomerContactBody.hasOwnProperty(elem)) {
                        response.setStatus(response.BAD_REQUEST);
                        return;
                    }
                })

                const newCustomerContact = this.customerContactDao.create(body.CustomerContactBody);

                if (!newCustomerContact) {
                    response.setStatus(500);
                    return { message: "Failed to create Customer Constact!" };
                }

                try {
                    ["Amount", "Currency", "Lead", "Owner", "Type", "Priority", "Probability", "Status"].forEach(elem => {
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
        } catch (e: any) {
            response.setStatus(response.BAD_REQUEST);
            return { error: e.message };
        }
    }
}