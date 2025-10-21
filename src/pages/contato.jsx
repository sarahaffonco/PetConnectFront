
import React from 'react';
import '../styles/contato.css';


const PETS_IMAGE_URL = './tchau.png'; // 
 

export default function Contato() {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulário enviado com sucesso!'); 
    
  };

  return (
    <>
      {/* -------------------- 1. SEÇÃO DO HEADER (Connect Pet) -------------------- */}
      <header className="header-section">
        <div className="header-paw-bg"></div>
        <div className="header-content-wrapper">
          <div className="branding">
            <h1>Connect Pet</h1>
            <p>Conectamos corações e alegras a você</p>
            <a href="#form" className="btn btn-header">
              Adopções
            </a>
          </div>
          <div className="image-banner">
            <span className="tchau-text">Tchau</span>
            <img src={PETS_IMAGE_URL} alt="Vários animais de estimação fofos" />
          </div>
        </div>
      </header>

      {/* -------------------- 2. SEÇÃO PRINCIPAL DE CONTATO -------------------- */}
      <section className="main-contact-section" id="form">
        <div className="slider-nav">
          <button className="slider-arrow">{'<'}</button>
          <button className="slider-arrow">{'>'}</button>
        </div>
        
        <h2 className="section-title">
          Preencha o Formulário ou entre em contato
        </h2>

        <div className="contact-container">
          
          {/* Lado Esquerdo: Formulário */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="First Name" required />
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Last Name" required />
              </div>
            </div>
            
            <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="E-mail address" required />
            </div>

            <div className="input-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Your message..."></textarea>
            </div>

            <button type="submit" className="btn btn-submit">
              Send Message
            </button>
          </form>

          {/* Lado Direito: Informações de Contato */}
          <div className="contact-info-block">
            <h3>Entre em contato</h3>
            <div className="contact-item">
              <span className="icon">📍</span>
              <p>0932 Fairground St, Tallahassee, FL 32303</p>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <p>petconnect@pets.com</p>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <p>+770 378-5346</p>
            </div>
            <div className="contact-item">
              <span className="icon">⏰</span>
              <p>Mon - Fri: 10AM - 10PM</p>
            </div>
          </div>
        </div>
        
        {/* Mapa na parte inferior da seção */}
        <div className="map-section">
          <iframe
            
            src="https://www.google.com/maps/embed?pb=..." 
            width="100%"
            height="100%"
            style={{ border: 0 }} 
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Connect Pet" 
          ></iframe>
        </div>
      </section>
    </>
  );
}