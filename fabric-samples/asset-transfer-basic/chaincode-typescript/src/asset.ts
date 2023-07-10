/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

// Exemplo de dados para serem adicionados à BlockChain
// 
// Tipo : 'jornalista' | 'organização' | 'empresa de mídia' | 'funcionário' | 'Obra'
// ID : string (identificador) 
// Nome : string (50 caracteres)
// Responsável : number (responsável por cadastrar)
// Estado : 'Cadastro' | 'Atualização' | 'Exclusão' 
// Link ?: string (100 caracteres?) (link do site ou do currículo)
// Descrição ?: string (280 caracteres)
// Organização Responsável ?: string (id da organização)
// Empresa Responsável ?: string (id da organização) 


@Object()
export class Asset {
    @Property()
    public docType?: string;

    @Property()
    public ID: string;

    @Property()
    public Color: string;

    @Property()
    public Size: number;

    @Property()
    public Owner: string;

    @Property()
    public AppraisedValue: number;
}
