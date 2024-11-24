---
title: "{{ replace .Name "-" " " | title }}"
description: ""  # Máximo 155 caracteres
type: "landing"
layout: "single"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true

# SEO
metaTitle: ""
metaDescription: ""
keywords: []

# URLs
url: "/tratamentos/{{ .Name }}/"
alternate:
  en: "/en/treatments/{{ .Name }}/"
  es: "/es/tratamientos/{{ .Name }}/"

# Imagens
featuredImage: ""
images: []

# Schema.org
schema:
  type: "Service"
  price: ""
  priceCurrency: "EUR"
  duration: ""
---

{{< section type="hero" >}}
{{< hero 
    title=""
    subtitle=""
    image=""
    cta="Agendar Consulta"
    cta_link="#contacto"
>}}
{{< /section >}}

{{< section type="benefits" >}}
{{< benefits 
    title="Benefícios"
    items=[
        {
            title="",
            description="",
            icon=""
        }
    ]
>}}
{{< /section >}}

{{< section type="image-text" >}}
{{< image-text
    title=""
    content=""
    image=""
    imagePosition="right"
>}}
{{< /section >}}

{{< section type="pricing" >}}
{{< pricing
    title="Investimento"
    packages=[
        {
            name="Sessão Única",
            price="60€",
            duration="60 minutos",
            features=[
                "Avaliação inicial",
                "Massagem personalizada",
                "Recomendações pós-sessão"
            ]
        }
    ]
>}}
{{< /section >}}

{{< section type="contact" id="contacto" >}}
{{< contact-form >}}
{{< /section >}}