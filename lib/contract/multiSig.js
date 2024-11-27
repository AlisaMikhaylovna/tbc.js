"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

Object.defineProperty(exports, "__esModule", { value: true });

var Script = require("../script")
var Address = require("../address")
var Base58 = require("../encoding/base58")
var Hash = require('../crypto/hash')
var BN = require("../crypto/bn")
var BufferWriter = require("../encoding/bufferwriter")
var Output = require("../transaction/output")
var Transaction = require("../transaction/transaction")

var Multisig = /** @class */ (function () {

    function Multisig(ft, network) {

        if (ft) {
            this.ft = ft;
        }

        if (network) {
            this.network = network;
        }
        else {
            this.network = "mainnet";
        }
    }

    Multisig.prototype.fetchUTXO = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var url_testnet, url_mainnet, url, scriptPubKey, response, data, selectedUTXO, i, utxo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url_testnet = "http://192.168.50.114:8080/v1/tbc/main/address/".concat(address, "/unspent/");
                        url_mainnet = "https://turingwallet.xyz/v1/tbc/main/address/".concat(address, "/unspent/");
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        scriptPubKey = Script.buildPublicKeyHashOut(address).toBuffer().toString('hex');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch UTXO: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        selectedUTXO = data[0];
                        for (i = 0; i < data.length; i++) {
                            if (data[i].value > 5000 && data[i].value < 3200000000) {
                                selectedUTXO = data[i];
                                break;
                            }
                        }
                        if (selectedUTXO.value < 5000) {
                            console.error('Error: UTXO value is less than 5000');
                            throw new Error('UTXO value is less than 5000');
                        }
                        utxo = {
                            txId: selectedUTXO.tx_hash,
                            outputIndex: selectedUTXO.tx_pos,
                            script: scriptPubKey,
                            satoshis: selectedUTXO.value
                        };
                        return [2 /*return*/, utxo];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error fetching UTXO:", error_1);
                        throw new Error("Failed to fetch UTXO.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fetchUTXOs = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var url_testnet, url_mainnet, url, scriptPubKey, response, data, utxos, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url_testnet = "http://192.168.50.114:8080/v1/tbc/main/address/".concat(address, "/unspent/");
                        url_mainnet = "https://turingwallet.xyz/v1/tbc/main/address/".concat(address, "/unspent/");
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        scriptPubKey = Script.buildPublicKeyHashOut(address).toBuffer().toString('hex');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch UTXO: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        utxos = data.map(function (utxo) {
                            return {
                                txId: utxo.tx_hash,
                                outputIndex: utxo.tx_pos,
                                script: scriptPubKey,
                                satoshis: utxo.value
                            };
                        });
                        return [2 /*return*/, utxos];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Error fetching UTXO:", error_2);
                        throw new Error("Failed to fetch UTXO.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fetchUMTXO = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var asmString, multiScript, hash, url_testnet, url_mainnet, url, response, data, selectedUTXO, i, umtxo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asmString = this.getMultisigLockScript(address);
                        multiScript = Script.fromASM(asmString).toHex();
                        hash = Buffer.from(Hash.sha256(Buffer.from(multiScript, "hex")).toString("hex"), "hex").reverse().toString("hex");
                        url_testnet = "http://192.168.50.114:8080/v1/tbc/main/script/hash/".concat(hash, "/unspent/");
                        url_mainnet = "https://turingwallet.xyz/v1/tbc/main/script/hash/".concat(hash, "/unspent/");
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch UMTXO: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        selectedUTXO = data[0];
                        for (i = 0; i < data.length; i++) {
                            if (data[i].value > 5000 && data[i].value < 3200000000) {
                                selectedUTXO = data[i];
                                break;
                            }
                        }
                        if (selectedUTXO.value < 5000) {
                            console.error('Error: UMTXO value is less than 5000');
                            throw new Error('UMTXO value is less than 5000');
                        }
                        umtxo = {
                            txId: selectedUTXO.tx_hash,
                            outputIndex: selectedUTXO.tx_pos,
                            script: multiScript,
                            satoshis: selectedUTXO.value
                        };
                        return [2 /*return*/, umtxo];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Error fetching UMTXO:", error_3);
                        throw new Error("Failed to fetch UMTXO.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fetchUMTXOs = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var asmString, multiScript, hash, url_testnet, url_mainnet, url, response, data, umtxos, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asmString = this.getMultisigLockScript(address);
                        multiScript = Script.fromASM(asmString).toHex();
                        hash = Buffer.from(Hash.sha256(Buffer.from(multiScript, "hex")).toString("hex"), "hex").reverse().toString("hex");
                        url_testnet = "http://192.168.50.114:8080/v1/tbc/main/script/hash/".concat(hash, "/unspent/");
                        url_mainnet = "https://turingwallet.xyz/v1/tbc/main/script/hash/".concat(hash, "/unspent/");
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch UTXO: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        umtxos = data.map(function (utxo) {
                            return {
                                txId: utxo.tx_hash,
                                outputIndex: utxo.tx_pos,
                                script: multiScript,
                                satoshis: utxo.value
                            };
                        });
                        return [2 /*return*/, umtxos];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Error fetching UTXO:", error_4);
                        throw new Error("Failed to fetch UTXO.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fetchFtTXO = function (contractTxid, addressOrHash, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, publicKeyHash, url_testnet, url_mainnet, url, response, responseData, data, i, fttxo_codeScript, fttxo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = '';
                        if (Address.isValid(addressOrHash)) {
                            publicKeyHash = Address.fromString(addressOrHash).hashBuffer.toString('hex');
                            hash = publicKeyHash + '00';
                        }
                        else {
                            // If the recipient is a hash
                            if (addressOrHash.length !== 40) {
                                throw new Error('Invalid address or hash');
                            }
                            hash = addressOrHash + '01';
                        }
                        url_testnet = "http://192.168.50.114:8080/v1/tbc/main/ft/utxo/combine/script/".concat(hash, "/contract/").concat(contractTxid);
                        url_mainnet = "https://turingwallet.xyz/v1/tbc/main/ft/utxo/combine/script/".concat(hash, "/contract/").concat(contractTxid);
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch from URL: ".concat(url, ", status: ").concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        responseData = _a.sent();
                        data = responseData.ftUtxoList[0];
                        for (i = 0; i < responseData.ftUtxoList.length; i++) {
                            if (responseData.ftUtxoList[i].ftBalance >= amount) {
                                data = responseData.ftUtxoList[i];
                                break;
                            }
                        }
                        fttxo_codeScript = this.ft.buildFTtransferCode(this.ft.codeScript, addressOrHash).toBuffer().toString('hex');
                        fttxo = {
                            txId: data.utxoId,
                            outputIndex: data.utxoVout,
                            script: fttxo_codeScript,
                            satoshis: data.utxoBalance,
                            ftBalance: data.ftBalance
                        };
                        return [2 /*return*/, fttxo];
                    case 4:
                        error_3 = _a.sent();
                        throw new Error("Failed to fetch FTTXO.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.broadcastTXraw = function (txraw) {
        return __awaiter(this, void 0, void 0, function () {
            var url_testnet, url_mainnet, url, response, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url_testnet = 'http://192.168.50.114:8080/v1/tbc/main/broadcast/tx/raw';
                        url_mainnet = 'https://turingwallet.xyz/v1/tbc/main/broadcast/tx/raw';
                        url = this.network == "testnet" ? url_testnet : url_mainnet;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                txHex: txraw
                            })
                        })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to broadcast TXraw: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        console.log('txid:', data.result);
                        if (data.error) {
                            console.log('error:', data.error);
                        }
                        return [2 /*return*/, data.result];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Error broadcasting TXraw:", error_4);
                        throw new Error("Failed to broadcast TXraw.");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.getHash = function (pubkeys) {
        var multiPublicKeys = "";
        for (var i = 0; i < pubkeys.length; i++) {
            multiPublicKeys = multiPublicKeys + pubkeys[i].toString();
        }
        var buf = Buffer.from(multiPublicKeys, "hex");
        var hash = Hash.sha256ripemd160(buf);
        return hash;
    };

    Multisig.prototype.createMultisigAddress = function (pubkeys, signatureCount, publicKeyCount) {
        if (signatureCount < 1 || signatureCount > 6) {
            throw new Error("Invalid signatureCount.");
        }
        if (publicKeyCount < 3 || publicKeyCount > 10) {
            throw new Error("Invalid publicKeyCount.");
        }
        var hash = this.getHash(pubkeys);
        var prefix = (signatureCount << 4) | (publicKeyCount & 0x0f);
        var versionBuffer = Buffer.from([prefix]);
        var addressBuffer = Buffer.concat([versionBuffer, hash]);
        var addressHash = Hash.sha256sha256(addressBuffer);
        var checksum = addressHash.subarray(0, 4);
        var addressWithChecksum = Buffer.concat([addressBuffer, checksum]);
        return Base58.encode(addressWithChecksum);
    };

    Multisig.prototype.getSignatureAndPublicKeyCount = function (buf) {
        var prefix = buf[0];
        var signatureCount = (prefix >> 4) & 0x0f;
        var publicKeyCount = prefix & 0x0f;
        return { signatureCount: signatureCount, publicKeyCount: publicKeyCount };
    };


    Multisig.prototype.getMultisigLockScript = function (address) {
        var buf = Buffer.from(Base58.decode(address));
        var _a = this.getSignatureAndPublicKeyCount(buf), signatureCount = _a.signatureCount, publicKeyCount = _a.publicKeyCount;
        if (signatureCount < 1 || signatureCount > 6) {
            throw new Error("Invalid signatureCount.");
        }
        if (publicKeyCount < 3 || publicKeyCount > 10) {
            throw new Error("Invalid publicKeyCount.");
        }
        var hash = buf.subarray(1, 21).toString("hex");
        var lockScriptPrefix = "";
        for (var i = 0; i < publicKeyCount - 1; i++) {
            lockScriptPrefix = lockScriptPrefix + "21 OP_SPLIT ";
        }
        for (var i = 0; i < publicKeyCount; i++) {
            lockScriptPrefix = lockScriptPrefix + "OP_".concat(publicKeyCount - 1, " OP_PICK ");
        }
        for (var i = 0; i < publicKeyCount - 1; i++) {
            lockScriptPrefix = lockScriptPrefix + "OP_CAT ";
        }
        var multisigLockScript = "OP_".concat(signatureCount, " OP_SWAP ") + lockScriptPrefix + "OP_HASH160 ".concat(hash, " OP_EQUALVERIFY OP_").concat(publicKeyCount, " OP_CHECKMULTISIG");
        return multisigLockScript;
    };

    Multisig.prototype.createP2pkhToMultisigTransaction = function (fromAddress, toAddress, satoshis, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var utxos, count, i, lockScript, tx, j, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchUTXOs(fromAddress)];
                    case 1:
                        utxos = _a.sent();
                        count = 0;
                        i = 0;
                        for (i; i < utxos.length; i++) {
                            if (count > satoshis + 1000) {
                                break;
                            }
                            else {
                                count += utxos[i].satoshis;
                            }
                        }
                        if (i == utxos.length && count <= satoshis + 1000) {
                            throw new Error("Insufficient balance");
                        }
                        lockScript = this.getMultisigLockScript(toAddress);
                        tx = new Transaction();
                        for (j = 0; j < i; j++) {
                            tx.from(utxos[j]);
                        }
                        tx.addOutput(new Output({
                            script: Script.fromASM(lockScript),
                            satoshis: satoshis
                        }))
                            .fee(300)
                            .change(fromAddress)
                            .sign(privateKey);
                        raw = tx.serialize();
                        return [4 /*yield*/, this.broadcastTXraw(raw)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fromMultisigTransaction = function (fromAddress, toAddress, satoshis) {
        return __awaiter(this, void 0, void 0, function () {
            var fromLockScript, umtxos, count, i, amounts, tx, j, toLockScript, txraw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromLockScript = this.getMultisigLockScript(fromAddress);
                        return [4 /*yield*/, this.fetchUMTXOs(fromAddress)];
                    case 1:
                        umtxos = _a.sent();
                        count = 0;
                        i = 0;
                        amounts = [];
                        for (i; i < umtxos.length; i++) {
                            if (count > satoshis + 1000) {
                                break;
                            }
                            else {
                                count += umtxos[i].satoshis;
                                amounts.push(umtxos[i].satoshis);
                            }
                        }
                        if (i == umtxos.length && count <= satoshis + 1000) {
                            throw new Error("Insufficient balance");
                        }
                        tx = new Transaction();
                        for (j = 0; j < i; j++) {
                            tx.from(umtxos[j]);
                        }
                        tx.fee(300);
                        if (toAddress.startsWith("1")) {
                            tx.to(toAddress, satoshis)
                                .addOutput(new Output({
                                    script: Script.fromASM(fromLockScript),
                                    satoshis: count - satoshis - 300
                                }));
                        }
                        else {
                            toLockScript = this.getMultisigLockScript(toAddress);
                            tx.addOutput(new Output({
                                script: Script.fromASM(toLockScript),
                                satoshis: satoshis
                            }))
                                .addOutput(new Output({
                                    script: Script.fromASM(fromLockScript),
                                    satoshis: count - satoshis - 300
                                }));
                        }
                        txraw = tx.uncheckedSerialize();
                        return [2 /*return*/, { txraw: txraw, amounts: amounts }];
                }
            });
        });
    };

    Multisig.prototype.signfromMultisigTransaction = function (fromAddress, multiTxraw, privateKey) {
        var fromLockScript = this.getMultisigLockScript(fromAddress);
        var txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
        var tx = new Transaction(txraw);
        for (var i = 0; i < amounts.length; i++) {
            tx.inputs[i].output = new Output({ script: Script.fromASM(fromLockScript), satoshis: amounts[i] });
        }
        var sigs = [];
        for (var i = 0; i < amounts.length; i++) {
            sigs[i] = (tx.getSignature(i, privateKey));
        }
        return sigs;
    };

    Multisig.prototype.createFromMultisigTransaction = function (fromAddress, multiTxraw, sigs, pubkeys) {
        return __awaiter(this, void 0, void 0, function () {
            var fromLockScript, txraw, amounts, tx, i, _loop_1, j, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromLockScript = this.getMultisigLockScript(fromAddress);
                        txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
                        tx = new Transaction(txraw);
                        for (i = 0; i < amounts.length; i++) {
                            tx.inputs[i].output = new Output({ script: Script.fromASM(fromLockScript), satoshis: amounts[i] });
                        }
                        _loop_1 = function (j) {
                            tx.setInputScript({
                                inputIndex: j
                            }, function (tx) {
                                var signature = "";
                                for (var i = 0; i < sigs[j].length; i++) {
                                    if (i < sigs[j].length - 1) {
                                        signature = signature + sigs[j][i] + " ";
                                    }
                                    else {
                                        signature = signature + sigs[j][i];
                                    }
                                }
                                var unlockingScript = Script.fromASM("OP_0 ".concat(signature, " ").concat(pubkeys));
                                return unlockingScript;
                            });
                        };
                        for (j = 0; j < amounts.length; j++) {
                            _loop_1(j);
                        }
                        raw = tx.uncheckedSerialize();
                        return [4 /*yield*/, this.broadcastTXraw(raw)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.p2pkhToMultiMintFT = function (privateKey_from, address_to) {
        return __awaiter(this, void 0, void 0, function () {
            var name, symbol, decimal, totalSupply, privateKey, hash, amountbn, amountwriter, i, tapeAmount, nameHex, symbolHex, decimalHex, tape, tapeSize, utxo, codeScript, tx, txraw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = this.ft.name;
                        symbol = this.ft.symbol;
                        decimal = this.ft.decimal;
                        totalSupply = this.ft.totalSupply * Math.pow(10, decimal);
                        privateKey = privateKey_from;
                        hash = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(address_to)).toBuffer())).toString("hex");
                        amountbn = new BN(totalSupply.toString());
                        amountwriter = new BufferWriter();
                        amountwriter.writeUInt64LEBN(amountbn);
                        for (i = 1; i < 6; i++) {
                            amountwriter.writeUInt64LEBN(new BN(0));
                        }
                        tapeAmount = amountwriter.toBuffer().toString('hex');
                        nameHex = Buffer.from(name, 'utf8').toString('hex');
                        symbolHex = Buffer.from(symbol, 'utf8').toString('hex');
                        decimalHex = decimal.toString(16).padStart(2, '0');
                        tape = Script.fromASM("OP_FALSE OP_RETURN ".concat(tapeAmount, " ").concat(decimalHex, " ").concat(nameHex, " ").concat(symbolHex, " 4654617065"));
                        tapeSize = tape.toBuffer().length;
                        return [4 /*yield*/, this.fetchUTXO(privateKey.toAddress().toString())];
                    case 1:
                        utxo = _a.sent();
                        codeScript = this.ft.getFTmintCode(utxo.txId, utxo.outputIndex, hash, tapeSize);
                        this.ft.codeScript = codeScript.toBuffer().toString('hex');
                        this.ft.tapeScript = tape.toBuffer().toString('hex');
                        tx = new Transaction()
                            .from(utxo)
                            .addOutput(new Output({
                                script: codeScript,
                                satoshis: 2000
                            }))
                            .addOutput(new Output({
                                script: tape,
                                satoshis: 0
                            }))
                            .feePerKb(100)
                            .change(privateKey.toAddress())
                            .sign(privateKey);
                        tx.seal();
                        txraw = tx.uncheckedSerialize();
                        this.ft.contractTxid = tx.hash;
                        return [4 /*yield*/, this.broadcastTXraw(txraw)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fromMultisigMintFt = function (address_from, address_to) {
        return __awaiter(this, void 0, void 0, function () {
            var name, symbol, decimal, totalSupply, amountbn, amountwriter, i, tapeAmount, nameHex, symbolHex, decimalHex, tape, tapeSize, umtxo, codeScript, hash, fromMultiLockScript, tx, txraw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = this.ft.name;
                        symbol = this.ft.symbol;
                        decimal = this.ft.decimal;
                        totalSupply = this.ft.totalSupply * Math.pow(10, decimal);
                        amountbn = new BN(totalSupply.toString());
                        amountwriter = new BufferWriter();
                        amountwriter.writeUInt64LEBN(amountbn);
                        for (i = 1; i < 6; i++) {
                            amountwriter.writeUInt64LEBN(new BN(0));
                        }
                        tapeAmount = amountwriter.toBuffer().toString('hex');
                        nameHex = Buffer.from(name, 'utf8').toString('hex');
                        symbolHex = Buffer.from(symbol, 'utf8').toString('hex');
                        decimalHex = decimal.toString(16).padStart(2, '0');
                        tape = Script.fromASM("OP_FALSE OP_RETURN ".concat(tapeAmount, " ").concat(decimalHex, " ").concat(nameHex, " ").concat(symbolHex, " 4654617065"));
                        tapeSize = tape.toBuffer().length;
                        return [4 /*yield*/, this.fetchUMTXO(address_from)];
                    case 1:
                        umtxo = _a.sent();
                        if (address_to.startsWith("1")) {
                            codeScript = this.ft.getFTmintCode(umtxo.txId, umtxo.outputIndex, address_to, tapeSize);
                        }
                        else {
                            hash = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(address_to)).toBuffer())).toString("hex");
                            codeScript = this.ft.getFTmintCode(umtxo.txId, umtxo.outputIndex, hash, tapeSize);
                        }
                        this.ft.codeScript = codeScript.toBuffer().toString('hex');
                        this.ft.tapeScript = tape.toBuffer().toString('hex');
                        fromMultiLockScript = this.getMultisigLockScript(address_from);
                        tx = new Transaction().from(umtxo)
                            .fee(1000)
                            .addOutput(new Output({
                                script: codeScript,
                                satoshis: 2000
                            }))
                            .addOutput(new Output({
                                script: tape,
                                satoshis: 0
                            }))
                            .addOutput(new Output({
                                script: Script.fromASM(fromMultiLockScript),
                                satoshis: umtxo.satoshis - 3000
                            }));
                        txraw = tx.serialize();
                        return [2 /*return*/, { txraw: txraw, amounts: [umtxo.satoshis] }];
                }
            });
        });
    };

    Multisig.prototype.signfromMultisigMintFTTransaction = function (address_from, multiTxraw, privateKey) {
        var txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
        var fromMultiLockScript = this.getMultisigLockScript(address_from);
        var tx = new Transaction(txraw);
        tx.inputs[0].output = new Output({ script: Script.fromASM(fromMultiLockScript), satoshis: amounts[0] });
        var sigs = [];
        sigs[0] = (tx.getSignature(0, privateKey));
        return sigs;
    };

    Multisig.prototype.createFromMultisigMintFTTransaction = function (address_from, multiTxraw, sigs, pubkeys) {
        return __awaiter(this, void 0, void 0, function () {
            var txraw, amounts, fromMultiLockScript, tx, raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
                        fromMultiLockScript = this.getMultisigLockScript(address_from);
                        tx = new Transaction(txraw);
                        tx.inputs[0].output = new Output({ script: Script.fromASM(fromMultiLockScript), satoshis: amounts[0] });
                        tx.setInputScript({
                            inputIndex: 0
                        }, function (tx) {
                            //@ts-ignore
                            var signature = "";
                            for (var i = 0; i < sigs[0].length; i++) {
                                if (i < sigs[0].length - 1) {
                                    signature = signature + sigs[0][i] + " ";
                                }
                                else {
                                    signature = signature + sigs[0][i];
                                }
                            }
                            var unlockingScript = Script.fromASM("OP_0 ".concat(signature, " ").concat(pubkeys));
                            return unlockingScript;
                        });
                        raw = tx.uncheckedSerialize();
                        this.ft.contractTxid = tx.hash;
                        return [4 /*yield*/, this.broadcastTXraw(raw)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.p2pkhToMultiFtTransfer = function (privateKey_from, address_to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var code, tape, decimal, privateKey, tapeAmountSetIn, amountbn, hash, fttxo_1, tapeAmountSum, tapeAmount, i, maxAmount, _a, amountHex, changeHex, utxo, tx, codeScript, tapeScript, changeCodeScript, changeTapeScript, txraw;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        code = this.ft.codeScript;
                        tape = this.ft.tapeScript;
                        decimal = this.ft.decimal;
                        privateKey = privateKey_from;
                        tapeAmountSetIn = [];
                        if (amount < 0) {
                            throw new Error('Invalid amount');
                        }
                        amountbn = BigInt(amount * Math.pow(10, decimal));
                        hash = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(address_to)).toBuffer())).toString("hex");
                        return [4 /*yield*/, this.fetchFtTXO(this.ft.contractTxid, privateKey.toAddress().toString(), amountbn)];
                    case 1:
                        fttxo_1 = _b.sent();
                        if (fttxo_1.ftBalance === undefined) {
                            throw new Error('ftBalance is undefined');
                        }
                        tapeAmountSetIn.push(fttxo_1.ftBalance);
                        tapeAmountSum = BigInt(0);
                        tapeAmount = BigInt(0);
                        for (i = 0; i < tapeAmountSetIn.length; i++) {
                            tapeAmount = BigInt(tapeAmountSetIn[i]);
                            tapeAmountSum += tapeAmount;
                        }
                        // Validate the decimal and amount
                        if (decimal > 18) {
                            console.error('Error: The maximum value for decimal cannot exceed 18');
                            throw new Error('The maximum value for decimal cannot exceed 18');
                        }
                        maxAmount = Math.pow(10, 18 - decimal);
                        if (amount > maxAmount) {
                            console.error("Error: When decimal is ".concat(decimal, ", the maximum amount cannot exceed ").concat(maxAmount));
                            throw new Error("When decimal is ".concat(decimal, ", the maximum amount cannot exceed ").concat(maxAmount));
                        }
                        // Check if the balance is sufficient
                        if (amountbn > tapeAmountSum) {
                            console.error('Error: Insufficient balance, please add more FT UTXOs');
                            throw new Error('Insufficient balance, please add more FT UTXOs');
                        }
                        _a = this.ft.buildTapeAmount(amountbn, tapeAmountSetIn), amountHex = _a.amountHex, changeHex = _a.changeHex;
                        return [4 /*yield*/, this.fetchUTXO(privateKey.toAddress().toString())];
                    case 2:
                        utxo = _b.sent();
                        tx = new Transaction()
                            .from(fttxo_1)
                            .from(utxo);
                        codeScript = this.ft.buildFTtransferCode(code, hash);
                        tx.addOutput(new Output({
                            script: codeScript,
                            satoshis: 2000
                        }));
                        tapeScript = this.ft.buildFTtransferTape(tape, amountHex);
                        tx.addOutput(new Output({
                            script: tapeScript,
                            satoshis: 0
                        }));
                        // If there's change, add outputs for the change
                        if (amountbn < tapeAmountSum) {
                            changeCodeScript = this.ft.buildFTtransferCode(code, privateKey.toAddress().toString());
                            tx.addOutput(new Output({
                                script: changeCodeScript,
                                satoshis: 2000
                            }));
                            changeTapeScript = this.ft.buildFTtransferTape(tape, changeHex);
                            tx.addOutput(new Output({
                                script: changeTapeScript,
                                satoshis: 0
                            }));
                        }
                        tx.feePerKb(100)
                            .change(privateKey.toAddress());
                        // Set the input script asynchronously for the FT UTXO
                        return [4 /*yield*/, tx.setInputScriptAsync({
                            inputIndex: 0,
                        }, function (tx) {
                            return __awaiter(_this, void 0, void 0, function () {
                                var unlockingScript;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.ft.getFTunlock(privateKey, tx, 0, fttxo_1.txId, fttxo_1.outputIndex)];
                                        case 1:
                                            unlockingScript = _a.sent();
                                            return [2 /*return*/, unlockingScript];
                                    }
                                });
                            });
                        })];
                    case 3:
                        // Set the input script asynchronously for the FT UTXO
                        _b.sent();
                        tx.sign(privateKey);
                        return [4 /*yield*/, tx.sealAsync()];
                    case 4:
                        _b.sent();
                        txraw = tx.uncheckedSerialize();
                        return [4 /*yield*/, this.broadcastTXraw(txraw)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };

    Multisig.prototype.fromMultisigTransferFt = function (privateKey_from, address_from, address_to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var code, tape, decimal, privateKey, tapeAmountSetIn, amountbn, hash_from, fttxo_1, tapeAmountSum, tapeAmount, i, maxAmount, _a, amountHex, changeHex, umtxo, fromMultiLockScript, tx, codeScript, hash_to, tapeScript, changeCodeScript, changeTapeScript, txraw;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        code = this.ft.codeScript;
                        tape = this.ft.tapeScript;
                        decimal = this.ft.decimal;
                        privateKey = privateKey_from;
                        tapeAmountSetIn = [];
                        if (amount < 0) {
                            throw new Error('Invalid amount');
                        }
                        amountbn = BigInt(amount * Math.pow(10, decimal));
                        hash_from = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(address_from)).toBuffer())).toString("hex");
                        return [4 /*yield*/, this.fetchFtTXO(this.ft.contractTxid, hash_from, amountbn)];
                    case 1:
                        fttxo_1 = _b.sent();
                        if (fttxo_1.ftBalance === undefined) {
                            throw new Error('ftBalance is undefined');
                        }
                        tapeAmountSetIn.push(fttxo_1.ftBalance);
                        tapeAmountSum = BigInt(0);
                        tapeAmount = BigInt(0);
                        for (i = 0; i < tapeAmountSetIn.length; i++) {
                            tapeAmount = BigInt(tapeAmountSetIn[i]);
                            tapeAmountSum += tapeAmount;
                        }
                        // Validate the decimal and amount
                        if (decimal > 18) {
                            console.error('Error: The maximum value for decimal cannot exceed 18');
                            throw new Error('The maximum value for decimal cannot exceed 18');
                        }
                        maxAmount = Math.pow(10, 18 - decimal);
                        if (amount > maxAmount) {
                            console.error("Error: When decimal is ".concat(decimal, ", the maximum amount cannot exceed ").concat(maxAmount));
                            throw new Error("When decimal is ".concat(decimal, ", the maximum amount cannot exceed ").concat(maxAmount));
                        }
                        // Check if the balance is sufficient
                        if (amountbn > tapeAmountSum) {
                            console.error('Error: Insufficient balance, please add more FT UTXOs');
                            throw new Error('Insufficient balance, please add more FT UTXOs');
                        }
                        _a = this.ft.buildTapeAmount(amountbn, tapeAmountSetIn, 1), amountHex = _a.amountHex, changeHex = _a.changeHex;
                        return [4 /*yield*/, this.fetchUMTXO(address_from)];
                    case 2:
                        umtxo = _b.sent();
                        fromMultiLockScript = this.getMultisigLockScript(address_from);
                        tx = new Transaction()
                            .from(umtxo)
                            .from(fttxo_1);
                        if (address_to.startsWith("1")) {
                            codeScript = this.ft.buildFTtransferCode(code, address_to);
                        }
                        else {
                            hash_to = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(address_to)).toBuffer())).toString("hex");
                            codeScript = this.ft.buildFTtransferCode(code, hash_to);
                        }
                        tapeScript = this.ft.buildFTtransferTape(tape, amountHex);
                        tx.addOutput(new Output({
                            script: codeScript,
                            satoshis: 2000
                        })).addOutput(new Output({
                            script: tapeScript,
                            satoshis: 0
                        }));
                        // If there's change, add outputs for the change
                        if (amountbn < tapeAmountSum) {
                            changeCodeScript = this.ft.buildFTtransferCode(code, hash_from);
                            tx.addOutput(new Output({
                                script: changeCodeScript,
                                satoshis: 2000
                            }));
                            changeTapeScript = this.ft.buildFTtransferTape(tape, changeHex);
                            tx.addOutput(new Output({
                                script: changeTapeScript,
                                satoshis: 0
                            }));
                        }
                        tx.fee(5000)
                            .addOutput(new Output({
                                script: Script.fromASM(fromMultiLockScript),
                                satoshis: umtxo.satoshis - 5000
                            }));
                        // Set the input script asynchronously for the FT UTXO
                        return [4 /*yield*/, tx.setInputScriptAsync({
                            inputIndex: 1,
                        }, function (tx) {
                            return __awaiter(_this, void 0, void 0, function () {
                                var unlockingScript;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.ft.getFTunlockSwap(privateKey, tx, 1, fttxo_1.txId, fttxo_1.outputIndex)];
                                        case 1:
                                            unlockingScript = _a.sent();
                                            return [2 /*return*/, unlockingScript];
                                    }
                                });
                            });
                        })];
                    case 3:
                        // Set the input script asynchronously for the FT UTXO
                        _b.sent();
                        txraw = tx.uncheckedSerialize();
                        return [2 /*return*/, { txraw: txraw, amounts: [umtxo.satoshis] }];
                }
            });
        });
    };

    Multisig.prototype.signfromMultisigTransferFTTransaction = function (fromAddress, multiTxraw, privateKey) {
        var fromMultiLockScript = this.getMultisigLockScript(fromAddress);
        var hash_from = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(fromAddress)).toBuffer())).toString("hex");
        var fttxo_codeScript = this.ft.buildFTtransferCode(this.ft.codeScript, hash_from).toBuffer().toString('hex');
        var txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
        var tx = new Transaction(txraw);
        tx.inputs[0].output = new Output({ script: Script.fromASM(fromMultiLockScript), satoshis: amounts[0] });
        tx.inputs[1].output = new Output({ script: Script.fromString(fttxo_codeScript), satoshis: 2000 });
        var sigs = [];
        sigs[0] = (tx.getSignature(0, privateKey));
        return sigs;
    };

    Multisig.prototype.createFromMultisigTransferFTTransaction = function (fromAddress, multiTxraw, sigs, pubkeys) {
        return __awaiter(this, void 0, void 0, function () {
            var fromMultiLockScript, hash_from, fttxo_codeScript, txraw, amounts, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromMultiLockScript = this.getMultisigLockScript(fromAddress);
                        hash_from = Hash.sha256ripemd160(Hash.sha256(Script.fromASM(this.getMultisigLockScript(fromAddress)).toBuffer())).toString("hex");
                        fttxo_codeScript = this.ft.buildFTtransferCode(this.ft.codeScript, hash_from).toBuffer().toString('hex');
                        txraw = multiTxraw.txraw, amounts = multiTxraw.amounts;
                        tx = new Transaction(txraw);
                        tx.inputs[0].output = new Output({ script: Script.fromASM(fromMultiLockScript), satoshis: amounts[0] });
                        tx.inputs[1].output = new Output({ script: Script.fromString(fttxo_codeScript), satoshis: 2000 });
                        tx.setInputScript({
                            inputIndex: 0
                        }, function (tx) {

                            var signature = "";
                            for (var i = 0; i < sigs[0].length; i++) {
                                if (i < sigs[0].length - 1) {
                                    signature = signature + sigs[0][i] + " ";
                                }
                                else {
                                    signature = signature + sigs[0][i];
                                }
                            }
                            var unlockingScript = Script.fromASM("OP_0 ".concat(signature, " ").concat(pubkeys));
                            return unlockingScript;
                        });
                        return [4 /*yield*/, this.broadcastTXraw(tx.uncheckedSerialize())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Multisig;
}());

module.exports = Multisig;
