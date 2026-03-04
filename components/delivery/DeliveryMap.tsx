// components/delivery/DeliveryMap.tsx
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
  LayersControl,
  ZoomControl,
  AttributionControl,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useCallback, useRef, useState } from "react";
import {
  CoverageZone,
  LatLng,
  MARACAIBO_CENTER,
  COVERAGE_ZONES,
} from "@/app/delivery/page";

// ─── Fix default icon paths broken by webpack ─────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ─── Custom SVG markers ────────────────────────────────────────────────────────
const createPinIcon = (color: string): DivIcon =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:36px; height:44px; position:relative;
        filter: drop-shadow(0 4px 12px ${color}66);
      ">
        <svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pinGrad" cx="40%" cy="30%">
              <stop offset="0%" stop-color="${lighten(color)}" />
              <stop offset="100%" stop-color="${color}" />
            </radialGradient>
          </defs>
          <path d="M18 0C8.06 0 0 8.06 0 18c0 12.77 18 26 18 26S36 30.77 36 18C36 8.06 27.94 0 18 0z"
                fill="url(#pinGrad)" />
          <circle cx="18" cy="17" r="7" fill="white" opacity="0.95"/>
          <circle cx="18" cy="17" r="4" fill="${color}"/>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });

const createStoreIcon = (): DivIcon =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:44px; height:52px; position:relative;
        filter: drop-shadow(0 6px 18px rgba(212,165,116,0.8));
        animation: pulse 2.5s ease-in-out infinite;
      ">
        <svg viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="storeGrad" cx="40%" cy="30%">
              <stop offset="0%" stop-color="#F4C48A"/>
              <stop offset="100%" stop-color="#D4A574"/>
            </radialGradient>
          </defs>
          <path d="M22 0C9.85 0 0 9.85 0 22c0 15.6 22 30 22 30S44 37.6 44 22C44 9.85 34.15 0 22 0z"
                fill="url(#storeGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          <circle cx="22" cy="21" r="13" fill="rgba(8,4,1,0.85)"/>
          <text x="22" y="26" text-anchor="middle" font-size="14" fill="#D4A574">🍪</text>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%,100%{transform:scale(1)}
          50%{transform:scale(1.08)}
        }
      </style>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -54],
  });

const createUserIcon = (): DivIcon =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:48px;height:48px;">
        <div style="
          position:absolute;inset:0;
          border-radius:50%;
          background:rgba(212,165,116,0.15);
          animation:ripple 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;inset:8px;
          border-radius:50%;
          background:linear-gradient(135deg,#D4A574,#A67040);
          border:3px solid white;
          box-shadow:0 4px 20px rgba(212,165,116,0.7);
          display:flex;align-items:center;justify-content:center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes ripple {
          0%{transform:scale(1);opacity:0.6}
          100%{transform:scale(2.2);opacity:0}
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26],
  });

function lighten(hex: string): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 60);
  const g = Math.min(255, ((num >> 8) & 0xff) + 40);
  const b = Math.min(255, (num & 0xff) + 30);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ─── Store origin (our bakery) ─────────────────────────────────────────────────
const STORE_LOCATION: LatLng = { lat: 10.6427, lng: -71.6125 };

// ─── Tile layers ───────────────────────────────────────────────────────────────
const TILE_LAYERS = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "© CartoDB",
    name: "Oscuro",
  },
  dark_nolabels: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    attribution: "© CartoDB",
    name: "Oscuro sin etiquetas",
  },
  positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© CartoDB",
    name: "Claro",
  },
};

// ─── Fly-to controller ────────────────────────────────────────────────────────
function FlyController({ flyTo }: { flyTo: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], 15, { duration: 1.4 });
    }
  }, [flyTo, map]);
  return null;
}

// ─── Click handler + reverse geocode ─────────────────────────────────────────
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (latLng: LatLng, address?: string) => void;
}) {
  useMapEvents({
    click(e) {
      const latLng: LatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
      // Nominatim reverse geocode (free, no key needed)
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`,
        { headers: { "Accept-Language": "es" } },
      )
        .then((r) => r.json())
        .then((data) => {
          const addr =
            data.display_name ||
            `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
          onMapClick(latLng, addr);
        })
        .catch(() => onMapClick(latLng));
    },
  });
  return null;
}

// ─── Custom zoom control ──────────────────────────────────────────────────────
function CustomZoomControl() {
  const map = useMap();
  return (
    <div
      style={{
        position: "absolute",
        bottom: "80px",
        right: "12px",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {[
        {
          label: "+",
          action: () => map.zoomIn(),
          title: "Acercar",
        },
        {
          label: "−",
          action: () => map.zoomOut(),
          title: "Alejar",
        },
        {
          label: "⊙",
          action: () =>
            map.flyTo([MARACAIBO_CENTER.lat, MARACAIBO_CENTER.lng], 12, {
              duration: 1,
            }),
          title: "Centrar en Maracaibo",
          fontSize: "11px",
        },
      ].map((btn) => (
        <button
          key={btn.label}
          title={btn.title}
          onClick={btn.action}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(8,4,1,0.92)",
            border: "1px solid rgba(212,165,116,0.25)",
            color: "#D4A574",
            fontSize: btn.fontSize ?? "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(212,165,116,0.7)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(212,165,116,0.25)")
          }
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// ─── Animated delivery route line ────────────────────────────────────────────
function DeliveryRouteLine({ from, to }: { from: LatLng; to: LatLng }) {
  const midLat = (from.lat + to.lat) / 2 + 0.008;
  const midLng = (from.lng + to.lng) / 2;
  const points: [number, number][] = [
    [from.lat, from.lng],
    [midLat, midLng],
    [to.lat, to.lng],
  ];

  return (
    <Polyline
      positions={points}
      pathOptions={{
        color: "#D4A574",
        weight: 2.5,
        opacity: 0.65,
        dashArray: "8 6",
      }}
    />
  );
}

// ─── Map legend ───────────────────────────────────────────────────────────────
function MapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        left: "12px",
        zIndex: 999,
        background: "rgba(8,4,1,0.92)",
        border: "1px solid rgba(212,165,116,0.2)",
        borderRadius: "12px",
        padding: "10px 14px",
        backdropFilter: "blur(8px)",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          color: "rgba(212,165,116,0.6)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        Leyenda
      </p>
      {[
        { color: "#D4A574", label: "Nuestra cocina" },
        { color: "#10b981", label: "Tu ubicación" },
        ...COVERAGE_ZONES.slice(0, 3).map((z) => ({
          color: z.color,
          label: z.name,
        })),
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "3px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: item.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "rgba(212,165,116,0.6)", fontSize: "9px" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Leaflet Map ─────────────────────────────────────────────────────────
interface DeliveryMapProps {
  center: LatLng;
  selectedLatLng: LatLng | null;
  flyTo: LatLng | null;
  coverageZones: CoverageZone[];
  onMapClick: (latLng: LatLng, address?: string) => void;
  onZoneClick: (zone: CoverageZone) => void;
}

export default function DeliveryMap({
  center,
  selectedLatLng,
  flyTo,
  coverageZones,
  onMapClick,
  onZoneClick,
}: DeliveryMapProps) {
  const [activeLayer, setActiveLayer] =
    useState<keyof typeof TILE_LAYERS>("dark");

  const storeIcon = createStoreIcon();
  const userIcon = createUserIcon();

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      zoomControl={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%", background: "#0D0A07" }}
      className="leaflet-dark"
    >
      {/* ── Tile layer ── */}
      <TileLayer
        url={TILE_LAYERS[activeLayer].url}
        attribution={TILE_LAYERS[activeLayer].attribution}
        maxZoom={19}
      />

      <AttributionControl position="bottomright" prefix={false} />

      {/* ── Click handler ── */}
      <ClickHandler onMapClick={onMapClick} />

      {/* ── Fly controller ── */}
      <FlyController flyTo={flyTo} />

      {/* ── Custom zoom ── */}
      <CustomZoomControl />

      {/* ── Coverage zones ── */}
      {coverageZones.map((zone, i) => (
        <Circle
          key={zone.name}
          center={[zone.center.lat, zone.center.lng]}
          radius={zone.radius}
          pathOptions={{
            fillColor: zone.color,
            fillOpacity: 0.08,
            color: zone.color,
            weight: 1.5,
            opacity: 0.4,
            dashArray: "4 4",
          }}
          eventHandlers={{
            click: () => onZoneClick(zone),
            mouseover: (e) =>
              e.target.setStyle({ fillOpacity: 0.18, opacity: 0.7 }),
            mouseout: (e) =>
              e.target.setStyle({ fillOpacity: 0.08, opacity: 0.4 }),
          }}
        >
          <Tooltip
            permanent={false}
            direction="center"
            className="leaflet-zone-tooltip"
            opacity={1}
          >
            <div
              style={{
                background: "rgba(8,4,1,0.95)",
                border: `1px solid ${zone.color}44`,
                borderRadius: "8px",
                padding: "6px 10px",
                color: zone.color,
                fontSize: "11px",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              📍 {zone.name} · {zone.time} · ${zone.fee.toFixed(2)}
            </div>
          </Tooltip>
        </Circle>
      ))}

      {/* Zone center dots */}
      {coverageZones.map((zone) => (
        <CircleMarker
          key={`dot-${zone.name}`}
          center={[zone.center.lat, zone.center.lng]}
          radius={3}
          pathOptions={{
            fillColor: zone.color,
            fillOpacity: 0.6,
            color: zone.color,
            weight: 0,
          }}
        />
      ))}

      {/* ── Store marker (our bakery) ── */}
      <Marker
        position={[STORE_LOCATION.lat, STORE_LOCATION.lng]}
        icon={storeIcon}
      >
        <Popup closeButton={false} className="leaflet-custom-popup">
          <div
            style={{
              background: "rgba(8,4,1,0.98)",
              border: "1px solid rgba(212,165,116,0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              minWidth: "180px",
            }}
          >
            <p
              style={{
                color: "#D4A574",
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              🍪 Nuestra Cocina
            </p>
            <p style={{ color: "rgba(212,165,116,0.55)", fontSize: "11px" }}>
              Centro de preparación
            </p>
            <p
              style={{
                color: "rgba(212,165,116,0.4)",
                fontSize: "10px",
                marginTop: "4px",
              }}
            >
              Horneamos fresco cada mañana
            </p>
          </div>
        </Popup>
        <Tooltip
          direction="top"
          offset={[0, -54]}
          opacity={0.95}
          permanent={false}
        >
          <div
            style={{
              background: "rgba(8,4,1,0.9)",
              border: "1px solid rgba(212,165,116,0.3)",
              borderRadius: "6px",
              padding: "4px 8px",
              color: "#D4A574",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            Nuestra cocina 🍪
          </div>
        </Tooltip>
      </Marker>

      {/* ── Selected user location ── */}
      {selectedLatLng && (
        <>
          <Marker
            position={[selectedLatLng.lat, selectedLatLng.lng]}
            icon={userIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target;
                const pos = m.getLatLng();
                onMapClick({ lat: pos.lat, lng: pos.lng });
              },
            }}
          >
            <Popup closeButton={false} className="leaflet-custom-popup">
              <div
                style={{
                  background: "rgba(8,4,1,0.98)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  minWidth: "180px",
                }}
              >
                <p
                  style={{
                    color: "#10b981",
                    fontSize: "13px",
                    fontWeight: 800,
                    marginBottom: "4px",
                  }}
                >
                  📍 Tu ubicación
                </p>
                <p style={{ color: "rgba(212,165,116,0.5)", fontSize: "10px" }}>
                  {selectedLatLng.lat.toFixed(4)},{" "}
                  {selectedLatLng.lng.toFixed(4)}
                </p>
                <p
                  style={{
                    color: "rgba(212,165,116,0.4)",
                    fontSize: "10px",
                    marginTop: "4px",
                  }}
                >
                  Arrastra para ajustar
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Route dashed line from store → user */}
          <DeliveryRouteLine from={STORE_LOCATION} to={selectedLatLng} />

          {/* Accuracy ring */}
          <Circle
            center={[selectedLatLng.lat, selectedLatLng.lng]}
            radius={200}
            pathOptions={{
              fillColor: "#10b981",
              fillOpacity: 0.06,
              color: "#10b981",
              weight: 1,
              opacity: 0.3,
              dashArray: "3 4",
            }}
          />
        </>
      )}

      {/* ── Layer toggle ── */}
      <div
        style={{
          position: "absolute",
          top: "52px",
          right: "12px",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {(
          Object.entries(TILE_LAYERS) as [
            keyof typeof TILE_LAYERS,
            (typeof TILE_LAYERS)[keyof typeof TILE_LAYERS],
          ][]
        ).map(([key, layer]) => (
          <button
            key={key}
            title={layer.name}
            onClick={() => setActiveLayer(key)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background:
                activeLayer === key
                  ? "rgba(212,165,116,0.3)"
                  : "rgba(8,4,1,0.92)",
              border:
                activeLayer === key
                  ? "1px solid rgba(212,165,116,0.7)"
                  : "1px solid rgba(212,165,116,0.2)",
              color: "#D4A574",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {key === "dark" ? "🌑" : key === "dark_nolabels" ? "⬛" : "☀️"}
          </button>
        ))}
      </div>

      {/* ── Legend ── */}
      <MapLegend />

      {/* ── Leaflet dark theme CSS injection ── */}
      <style>{`
        .leaflet-container {
          font-family: inherit;
          cursor: crosshair;
        }
        .leaflet-control-attribution {
          background: rgba(8,4,1,0.7) !important;
          color: rgba(212,165,116,0.3) !important;
          font-size: 9px !important;
          border-radius: 6px 0 0 0 !important;
        }
        .leaflet-control-attribution a {
          color: rgba(212,165,116,0.4) !important;
        }
        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip::before {
          display: none !important;
        }
        .leaflet-zone-tooltip {
          pointer-events: none;
        }
        .leaflet-container.leaflet-touch-zoom {
          -ms-touch-action: pan-x pan-y;
          touch-action: pan-x pan-y;
        }
      `}</style>
    </MapContainer>
  );
}
