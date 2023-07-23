/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Asset} from './asset';
import { link } from 'fs';

@Info({title: 'AssetTransfer', description: 'Smart contract for trading assets'})
export class AssetTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const assets: Asset[] = [
            {
                Tipo: 'funcionário',
                ID: 'Funcionario_000001_Inicial',
                Nome: 'Luiza N Gomes',
                Responsavel: 1,
                Estado: 'DF',
                Link: 'link',
                Descricao: 'Primeira pessoa logada no DPJB',
                OrganizacaoResponsavel: null,
                EmpresaResponsavel: null,
            },
            {
                Tipo: 'organização',
                ID: 'Organizacao_000001_Cadastrada_por_LuizaNGomes',
                Nome: 'Exemplo',
                Responsavel: 1,
                Estado: 'SP',
                Link: 'link',
                Descricao: 'Exemplo de Org inicial',
                OrganizacaoResponsavel: null,
                EmpresaResponsavel: null,
            },
            {
                Tipo: 'empresa de mídia',
                ID: 'Empresa_000001_Cadastrada_por_LuizaNGomes',
                Nome: 'Galãs Feios',
                Responsavel: 1,
                Estado: 'SP',
                Link: 'link',
                Descricao: 'Exemplo de Org inicial',
                OrganizacaoResponsavel: null,
                EmpresaResponsavel: null,
            },
            {
                Tipo: 'jornalista',
                ID: 'Jornalista_000001_Nome_HelderMaldonado_Currículo_<link>_Cadastrado_por_LuizaNGomes',
                Nome: 'Helder Maldonado',
                Responsavel: 1,
                Estado: 'SP',
                Link: 'link',
                Descricao: 'Jornalista do canal Galãs Feios',
                OrganizacaoResponsavel: 'Exemplo',
                EmpresaResponsavel: 'Empresa_000001_Cadastrada_por_LuizaNGomes',
            },
            {
                Tipo: 'obra',
                ID: 'Jornalista_000001_Obra_00000001_Conteudo_<https://youtu.be/iRxwt8n9avo>_Instituicao_000001',
                Nome: 'Greve em Hollywood faz incel chamar Barbie de feia',
                Responsavel: 1,
                Estado: 'DF',
                Link: 'link',
                Descricao: 'Margot Robbie, protagonista de Barbie, sinalizou apoio à pausa sindical. O posicionamento dela tem gerado críticas infundadas sobre a beleza da atriz, que partem principalmente de um grupo de incels idosos brasileiros. Helder comenta.',
                OrganizacaoResponsavel: 'Exemplo',
                EmpresaResponsavel: 'Empresa_000001_Cadastrada_por_LuizaNGomes',
            },
        ];


        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    @Transaction()
    public async CreateAsset(ctx: Context, tipo: string, id: string, nome: string, responsavel: number, estado: string, link: string, descricao: string, organizacaoResponsavel: string, empresaResponsavel: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            Tipo: tipo,
            ID: id,
            Nome: nome,
            Responsavel: responsavel,
            Estado: estado,
            Link: link,
            Descricao: descricao,
            OrganizacaoResponsavel: organizacaoResponsavel,
            EmpresaResponsavel: empresaResponsavel,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, id: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    @Transaction()
    public async UpdateAsset(ctx: Context, tipo: string, id: string, nome: string, responsavel: number, estado: string, link: string, descricao: string, organizacaoResponsavel: string, empresaResponsavel: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            Tipo: tipo,
            ID: id,
            Nome: nome,
            Responsavel: responsavel,
            Estado: estado,
            Link: link,
            Descricao: descricao,
            OrganizacaoResponsavel: organizacaoResponsavel,
            EmpresaResponsavel: empresaResponsavel,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    @Transaction()
    public async DeleteAsset(ctx: Context, id: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async TransferAsset(ctx: Context, id: string, newResponsavel: string): Promise<string> {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldResponsavel = asset.Responsavel;
        asset.Responsavel = newResponsavel;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldResponsavel;
    }

    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllAssets(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}
