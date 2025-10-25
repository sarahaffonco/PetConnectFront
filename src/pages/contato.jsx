import React from "react";
import "../styles/contato.css";
import tchau from "../assets/tchau.png";

export default function Contato() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulário enviado com sucesso!");
  };

  return (
    <>
      {/*  SEÇÃO DO HEADER (Connect Pet)  */}
      <header className="header-section">
        <div className="header-paw-bg"></div>
        <div className="header-content-wrapper">
          <div className="branding">
            <h1>Connect Pet</h1>
            <p>Conectamos corações e alegras a você</p>
            <a href="#form" className="btn btn-header">
              Adoções
            </a>
          </div>
          <div className="image-banner">
            <img src={tchau} alt="Vários animais de estimação fofos" />
          </div>
        </div>
      </header>

      {/*  SEÇÃO PRINCIPAL DE CONTATO  */}
      <section className="main-contact-section" id="form">

        <h2 className="section-title">
          Entre em contato
        </h2>

        <div className="contact-container">
          {/* Lado Esquerdo: Formulário */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="firstName">Nome</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Nome"
                  required
                />
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Sobrenome</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Sobrenome"
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="email">E-mail </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail "
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                name="message"
                placeholder="Deixe sua mensagem..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-submit">
              Enviar
            </button>
          </form>

          {/* Lado Direito: Informações de Contato */}
          <div className="contact-info-block">
            <div className="contact-item">
              <span className="icon">📍</span>
              <p>Ceará</p>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <p>petconnect@pets.com</p>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <p>(85) 99115-7777</p>
            </div>
            <div className="contact-item">
              <span className="icon">⏰</span>
              <p>24h por dia</p>
            </div>
          </div>
        </div>

        {/* Mapa na parte inferior da seção */}
        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000244.467641384!2d-40.92773450254435!3d-5.216158718134382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0a9a6f27a2b8f%3A0x6b7e3f17f5f8d87!2sCear%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1735068900000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Connect Pet - Ceará"
          />
        </div>
      </section>
    </>
  );
}
