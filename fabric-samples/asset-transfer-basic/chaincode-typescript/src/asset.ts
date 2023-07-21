/*
  SPDX-License-Identifier: Apache-2.0
*/

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

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string;
    
    @Property()
    public Tipo: string;

    @Property()
    public ID: string;

    @Property()
    public Nome: string;

    @Property()
    public Responsavel: number;

    @Property()
    public Estado: string;

    @Property()
    public Link?: string;

    @Property()
    public Descricao?: string;

    @Property()
    public OrganizacaoResponsavel?: string;

    @Property()
    public EmpresaResponsavel?: string;
}