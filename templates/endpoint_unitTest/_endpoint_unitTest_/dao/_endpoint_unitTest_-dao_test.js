import mongoose from "mongoose";
import #endpoint_unitTest#DAO from "../../../../server/api/_endpoint_unitTest_/dao/_endpoint_unitTest_-dao";
import { expect } from "chai";
import { setupMongoose, create#endpoint_unitTest# } from "../../_helpers/db";

describe("_endpoint_unitTest_.dao", () => {
    before(() => {
        setupMongoose(mongoose);
    });

    afterEach((done) => {
        #endpoint_unitTest#DAO.remove({}, () => done());
    })

    describe("getAll", () => {
        beforeEach((done) => {
            create#endpoint_unitTest#()
                .then(() => done())
                .catch(() => done());
        })

        it("should get all _endpoint_unitTest_", (done) => {
            let _onSuccess = _endpoint_unitTest_s => {
                expect(_endpoint_unitTest_s).to.be.defined;
                expect(_endpoint_unitTest_s[0]).to.have.property("_endpoint_unitTest_Message").and.to.equal("aaaaaaa0");
                expect(_endpoint_unitTest_s[0]).to.have.property("createdAt").and.to.be.defined;

                done();
            }

            let _onError = (err) => {
                expect(true).to.be.false; // should not come here
            }

            #endpoint_unitTest#DAO
                .getAll()
                .then(_onSuccess)
                .catch(_onError);
        })
    })

    describe("create#endpoint_unitTest#", () => {
        it("should throw an error, object passed is not defined", (done) => {
            let _undefined#endpoint_unitTest# = undefined;

            let _onSuccess = () => {
                expect(true).to.be.false; // should not come here;
            }

            let _onError = error => {
                expect(error).to.be.defined;

                done();
            }

            #endpoint_unitTest#DAO
                .create#endpoint_unitTest#(_undefined#endpoint_unitTest#)
                .then(_onSuccess)
                .catch(_onError);
        })

    it("should create the _endpoint_unitTest_ correctly", (done) => {
        let __endpoint_unitTest_ = { _endpoint_unitTest_Message: "abc" };

        let _onSuccess = _endpoint_unitTest_ => {
                expect(_endpoint_unitTest_).to.be.defined;
                expect(_endpoint_unitTest_._endpoint_unitTest_Message).to.equal("abc");
                expect(_endpoint_unitTest_.createdAt).to.be.defined;

                done();
            }

            let _onError = () => {
                expect(true).to.be.false;
            }

        #endpoint_unitTest#DAO
            .createTodo(__endpoint_unitTest_)
                .then(_onSuccess)
                .catch(_onError);
        })
    })

describe("delete#endpoint_unitTest#", () => {
        beforeEach((done) => {
            create#endpoint_unitTest#s()
                .then(() => done())
                .catch(() => done());
        })

        it("should get an error back, id is not defined", (done) => {
            let _id = null;

            let _onSuccess = () => {
                expect(true).to.be.false;
            }

            let _onError = error => {
                expect(error).to.be.defined;

                done();
            }

            #endpoint_unitTest#DAO
                .delete#endpoint_unitTest#(_id)
                .then(_onSuccess)
                .catch(_onError);
        })

        it("should delete the doc successfully", (done) => {
            let _id = "507c7f79bcf86cd7994f6c10";

            let _onSuccess = () => {
                expect(true).to.be.true;

                done();
            }

            let _onError = () => {
                expect(true).to.be.false;
            }

            #endpoint_unitTest#DAO
                .delete#endpoint_unitTest#(_id)
                .then(_onSuccess)
                .catch(_onError);
        })
    })
})
