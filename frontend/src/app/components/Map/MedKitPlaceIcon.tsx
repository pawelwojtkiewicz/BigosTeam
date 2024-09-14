import L from 'leaflet';

const MedKitPlaceIcon = L.divIcon({
    html: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-9gwpq2" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MedicalServicesIcon"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2M10 4h4v2h-4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3z"></path></svg>`,
    className: "",
    iconSize: [24, 40],
    iconAnchor: [12, 40],
});

export default MedKitPlaceIcon;
