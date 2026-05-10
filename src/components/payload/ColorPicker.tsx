'use client';

import React, { useCallback, useMemo } from 'react';
import { useField, FieldLabel } from '@payloadcms/ui';

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

interface ColorPickerProps {
  path: string;
  field: {
    label?: string | Record<string, string>;
    required?: boolean;
    admin?: {
      description?: string;
    };
  };
}

function normalizeHex(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function expandShortHex(value: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return value;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });

  const stringValue = typeof value === 'string' ? value : '';
  const normalized = normalizeHex(stringValue);
  const isValidHex = HEX_PATTERN.test(normalized);

  const colorInputValue = useMemo<string>(() => {
    if (!isValidHex) return '#000000';
    return expandShortHex(normalized).toLowerCase();
  }, [normalized, isValidHex]);

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  const onPickerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  const labelValue =
    typeof field.label === 'string'
      ? field.label
      : field.label?.['pt'] || field.label?.['en'] || path;

  return (
    <div className="field-type" style={{ marginBottom: '1rem' }}>
      <FieldLabel label={labelValue} required={field.required} path={path} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '0.25rem',
        }}
      >
        <input
          type="color"
          value={colorInputValue}
          onChange={onPickerChange}
          aria-label={`Seletor visual de cor para ${labelValue}`}
          style={{
            width: '48px',
            height: '40px',
            padding: 0,
            border: '1px solid var(--theme-elevation-150, #ccc)',
            borderRadius: '6px',
            cursor: 'pointer',
            background: 'transparent',
          }}
        />
        <input
          type="text"
          value={stringValue}
          onChange={onTextChange}
          placeholder="#ac5b30"
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={stringValue !== '' && !isValidHex}
          style={{
            flex: '0 1 160px',
            height: '40px',
            padding: '0 0.6rem',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            border: `1px solid ${
              stringValue !== '' && !isValidHex
                ? '#dc2626'
                : 'var(--theme-elevation-150, #ccc)'
            }`,
            borderRadius: '6px',
            background: 'var(--theme-input-bg, #fff)',
            color: 'var(--theme-text, inherit)',
          }}
        />
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--theme-elevation-150, #ccc)',
            background: isValidHex ? normalized : 'transparent',
            backgroundImage: isValidHex
              ? 'none'
              : 'repeating-conic-gradient(#eee 0% 25%, transparent 0% 50%) 50% / 12px 12px',
          }}
        />
      </div>
      {field.admin?.description && (
        <p
          style={{
            marginTop: '0.4rem',
            fontSize: '0.78rem',
            color: 'var(--theme-elevation-500, #666)',
          }}
        >
          {field.admin.description}
        </p>
      )}
      {stringValue !== '' && !isValidHex && (
        <p
          style={{
            marginTop: '0.4rem',
            fontSize: '0.78rem',
            color: '#dc2626',
          }}
        >
          Cor inválida. Use o formato #RRGGBB (ex: #ac5b30).
        </p>
      )}
    </div>
  );
};

export default ColorPicker;
