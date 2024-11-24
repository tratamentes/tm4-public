---
title: "Política de Privacidade"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
menu: footer
company:
  name: "{{ replace .Name "-" " " | title }}"
  owner: ""
  nif: ""
  address: ""
  email: ""
  phone: ""
---

# Política de Privacidade

**Última atualização:** {{ if .Lastmod }}{{ dateFormat "02 de January de 2006" .Lastmod }}{{ else }}{{ dateFormat "02 de January de 2006" .Date }}{{ end }}

## 1. Identificação do Responsável pelo Tratamento

{{ .Params.company.name }}  
{{ .Params.company.owner }}  
NIF: {{ .Params.company.nif }}  
Morada: {{ .Params.company.address }}  
Email: {{ .Params.company.email }}  
Telefone: {{ .Params.company.phone }}

## 2. Compromisso de Privacidade

A {{ .Params.company.name }} está empenhada em proteger a privacidade e os dados pessoais dos seus clientes e utilizadores. Esta política de privacidade descreve como recolhemos, utilizamos, tratamos e protegemos os seus dados pessoais, em conformidade com o Regulamento Geral de Proteção de Dados (RGPD) e demais legislação aplicável.

## 3. Dados Pessoais que Recolhemos

### 3.1 Através do Website
[Liste aqui os dados recolhidos através do website]

### 3.2 Durante a Prestação de Serviços
[Liste aqui os dados recolhidos durante a prestação de serviços]

## 4. Finalidades do Tratamento

Os seus dados pessoais são tratados para as seguintes finalidades:

### 4.1 Prestação de Serviços
[Liste aqui as finalidades relacionadas com a prestação de serviços]

### 4.2 Comunicação
[Liste aqui as finalidades relacionadas com comunicação]

### 4.3 Gestão do Website
[Liste aqui as finalidades relacionadas com o website]

## 5. Fundamentos Legais

[Liste aqui os fundamentos legais para o tratamento de dados]

## 6. Prazo de Conservação

[Defina aqui os prazos de conservação dos diferentes tipos de dados]

## 7. Partilha de Dados

[Liste aqui com quem os dados podem ser partilhados]

## 8. Medidas de Segurança

[Liste aqui as medidas de segurança implementadas]

## 9. Os Seus Direitos

De acordo com o RGPD, tem os seguintes direitos:
[Liste aqui os direitos dos titulares dos dados]

## 10. Cookies e Tecnologias Similares

[Inclua aqui informação sobre cookies ou link para política de cookies]

## 11. Alterações à Política de Privacidade

Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. As alterações serão publicadas nesta página com a data de última atualização.

## 12. Contacto

Para questões relacionadas com a proteção dos seus dados pessoais, contacte-nos através dos meios indicados na secção 1.

---

© {{ now.Format "2006" }} {{ .Params.company.name }}. Todos os direitos reservados.