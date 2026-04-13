'use client';
import React, { useState } from 'react';
import { useFormFields } from '@payloadcms/ui/forms/Form';

const WhatsAppMessage: React.FC = () => {
    const [coupleName, setCoupleName] = useState<string>('Nome do Casal');

    React.useEffect(() => {
      let mounted = true;

      const loadSiteSettings = async (): Promise<void> => {
        try {
          const response = await fetch('/api/globals/site-settings?depth=1');
          if (!response.ok) return;

          const data = await response.json();
          const value = data?.couple?.coupleName;

          if (mounted && typeof value === 'string' && value.trim()) {
            setCoupleName(value.trim());
          }
        } catch {
          // Ignore fetch errors in admin helper widget.
        }
      };

      loadSiteSettings();

      return () => {
        mounted = false;
      };
    }, []);

    // Pegar os valores de formulário criados (ainda podem estar sendo digitados)
    const { groupName, phone, token, securityCode } = useFormFields(([fields]) => ({
      groupName: fields.groupName?.value,
      phone: fields.phone?.value,
      token: fields.token?.value,
      securityCode: fields.securityCode?.value,
    }));

    if (!token || !securityCode || !groupName) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p><strong>Aviso:</strong> Salve o registro pela primeira vez para gerar o Link e o Código de Segurança do WhatsApp.</p>
        </div>
      );
    }
  
    // Use current browser origin in dev to avoid wrong links when Next changes port
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const linkRsvp = `${baseUrl}/rsvp/${token}`;
  
    const mensagem = `Olá ${groupName}, tudo bem? 

  Estamos aqui para *confirmar a sua presença* no Casamento do ${coupleName}!
Sua confirmação é de suma importância para que possamos nos organizar melhor.

Queremos você nesse dia tão importante para nós! Caso não consiga ir, por favor fique à vontade para clicar em "Não comparecerá".

Clique aqui para confirmar: ${linkRsvp}

*ATENÇÃO*
Na hora de confirmar, o site vai pedir um código de segurança. O seu código é:
*${securityCode}*

Com carinho, ${coupleName}!`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mensagem);
        alert('Mensagem copiada para a área de transferência!');
    };

    const zapLink = `https://wa.me/55${String(phone).replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    
    return (
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '10px' }}>Mensagem Pronta para o WhatsApp</h4>
        <textarea
            readOnly
            style={{ width: '100%', height: '300px', padding: '10px', fontFamily: 'monospace' }}
            value={mensagem}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
                type='button'
                onClick={copyToClipboard}
                style={{ padding: '10px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Copiar Mensagem
            </button>
            <a 
                href={zapLink}
                target="_blank" 
                rel="noreferrer"
                style={{ padding: '10px 15px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', textDecoration: 'none' }}
            >
                Abrir WhatsApp Web
            </a>
        </div>
      </div>
    );
  };

export default WhatsAppMessage;