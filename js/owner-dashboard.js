/* Byer — Owner Dashboard
   Dashboard bailleur avec slides horizontales par catégorie,
   stats portefeuille, et navigation entités mères/filles.
   ═══════════════════════════════════════════════════ */

/* ─── OWNER DASHBOARD SCREEN ─────────────────────── */
function OwnerDashboardScreen({ onBack, onViewBuilding, onManageTechs, onManagePros, onBoost, onAddListing }) {
  const [activeOwner] = useState("Ekwalla M.");
  const [chartPeriod, setChartPeriod] = useState("6m"); // 3m | 6m | 12m
  /* Filtre ville/région — "all" = tout Cameroun, sinon nom de la ville */
  const [cityFilter, setCityFilter] = useState("all");
  /* Delegation state — sheet ouvert pour quel building */
  const [delegationFor, setDelegationFor] = useState(null);
  const [delegationsMap, setDelegationsMap] = useState(() => delegations.getAll());
  /* Re-sync from storage helper après chaque update */
  const refreshDelegations = () => setDelegationsMap(delegations.getAll());
  const owner = OWNERS[activeOwner];
  if (!owner) return null;

  /* Liste de toutes les villes présentes dans le portefeuille (immo + véhicules)
     pour construire les chips de filtre dynamiquement. */
  const allCitiesSet = new Set();
  owner.buildings.forEach(b => {
    const c = (b.address || "").split(",").pop().trim() || owner.city;
    allCitiesSet.add(c);
  });
  (owner.vehicles || []).forEach(v => v.city && allCitiesSet.add(v.city));
  const allCities = Array.from(allCitiesSet);

  /* Helper : extrait la ville d'un building depuis son address (dernier segment) */
  const cityOf = (b) => (b.address || "").split(",").pop().trim() || owner.city;

  /* Buildings filtrés selon la ville sélectionnée */
  const filteredBuildings = cityFilter === "all"
    ? owner.buildings
    : owner.buildings.filter(b => cityOf(b) === cityFilter);

  /* Véhicules filtrés selon la ville sélectionnée */
  const ownerVehicles = owner.vehicles || [];
  const filteredVehicles = cityFilter === "all"
    ? ownerVehicles
    : ownerVehicles.filter(v => v.city === cityFilter);

  const totalUnits   = filteredBuildings.reduce((s,b)=>s+b.units.length,0);
  const availUnits   = filteredBuildings.reduce((s,b)=>s+b.units.filter(u=>u.available).length,0);
  const occupiedUnits= totalUnits - availUnits;
  const occupancyPct = totalUnits>0 ? Math.round((occupiedUnits/totalUnits)*100) : 0;
  const totalRevenue = filteredBuildings.reduce((s,b)=>s+b.units.reduce((ss,u)=>ss+(u.monthPrice||u.nightPrice*20),0),0);

  /* Synthèse revenus mensuels — généré à partir du portfolio
     Chaque mois oscille autour de la moyenne, simulant occupation variable.
     Stable (déterministe) basé sur le nom du propriétaire pour des données reproductibles. */
  const monthlyChart = (() => {
    const monthsCount = chartPeriod === "3m" ? 3 : chartPeriod === "12m" ? 12 : 6;
    const baseMonthly = totalRevenue * (occupancyPct / 100); // revenu mensuel attendu
    const labels = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    const now = new Date();
    const seed = activeOwner.charCodeAt(0);
    const data = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // Pseudo-rand stable : oscillation +/- 18%
      const noise = Math.sin((d.getMonth() + 1) * seed * 0.7) * 0.18;
      const value = Math.round(baseMonthly * (1 + noise));
      data.push({ label: labels[d.getMonth()], value, isCurrent: i === 0 });
    }
    return data;
  })();
  const chartMax = Math.max(1, ...monthlyChart.map(m => m.value));
  const chartTotal = monthlyChart.reduce((s,m) => s + m.value, 0);
  const chartAvg   = Math.round(chartTotal / monthlyChart.length);

  /* Group buildings by type for category slides (utilise la liste filtrée) */
  const typeGroups = {};
  filteredBuildings.forEach(b => {
    if (!typeGroups[b.type]) typeGroups[b.type] = [];
    typeGroups[b.type].push(b);
  });
  const typeLabels = { immeuble:"Immeubles", villa:"Villas", hotel:"Hôtels", motel:"Motels" };
  const typeIcons  = { immeuble:"hotel", villa:"villa", hotel:"hotel", motel:"motel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Mon Dashboard</p>
          <div style={{width:38}}/>
        </div>

        {/* Owner card */}
        <div style={{margin:"12px 16px",background:C.white,borderRadius:18,padding:"16px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <FaceAvatar photo={owner.photo} avatar={owner.avatar} bg={owner.avatarBg} size={52} radius={26}/>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>{owner.name}</p>
            <p style={{fontSize:12,color:C.light}}>Bailleur depuis {owner.since} · {owner.city}</p>
          </div>
          {owner.superhost && (
            <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:"#FFF5F5",color:C.coral}}>Superhost</span>
          )}
        </div>

        {/* City filter chips — filtre tout le dashboard par ville */}
        {allCities.length > 1 && (
          <div style={{display:"flex",gap:6,padding:"0 16px 12px",overflowX:"auto",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.4,marginRight:4,flexShrink:0}}>📍 Ville :</span>
            <button
              onClick={()=>setCityFilter("all")}
              style={{
                flexShrink:0,padding:"6px 12px",borderRadius:18,cursor:"pointer",
                border:`1.5px solid ${cityFilter==="all"?C.coral:C.border}`,
                background:cityFilter==="all"?"#FFF5F5":C.white,
                color:cityFilter==="all"?C.coral:C.mid,
                fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
              }}
            >Toutes</button>
            {allCities.map(city => (
              <button
                key={city}
                onClick={()=>setCityFilter(city)}
                style={{
                  flexShrink:0,padding:"6px 12px",borderRadius:18,cursor:"pointer",
                  border:`1.5px solid ${cityFilter===city?C.coral:C.border}`,
                  background:cityFilter===city?"#FFF5F5":C.white,
                  color:cityFilter===city?C.coral:C.mid,
                  fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
                }}
              >{city}</button>
            ))}
          </div>
        )}

        {/* Stats cards */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:16,overflowX:"auto"}}>
          {[
            {val:owner.buildings.length, label:"Propriétés", icon:"🏠", color:"#6366F1"},
            {val:totalUnits,             label:"Unités",      icon:"🚪", color:"#0EA5E9"},
            {val:occupancyPct+"%",       label:"Occupation",  icon:"📊", color:occupancyPct>=70?"#16A34A":"#F59E0B"},
            {val:fmt(totalRevenue),      label:"Rev. estimé", icon:"💰", color:C.coral},
          ].map((s,i)=>(
            <div key={i} style={{flexShrink:0,minWidth:110,background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 8px rgba(0,0,0,.05)",display:"flex",flexDirection:"column",gap:6}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <span style={{fontSize:18,fontWeight:800,color:s.color}}>{s.val}</span>
              <span style={{fontSize:10,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div style={{margin:"0 16px 16px",background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.black}}>Revenus estimés</p>
              <p style={{fontSize:10,color:C.light,marginTop:1,fontFamily:"'DM Sans',sans-serif"}}>
                Moy. {fmt(chartAvg)} F · Total {fmt(chartTotal)} F
              </p>
            </div>
            {/* Period selector */}
            <div style={{display:"flex",gap:4,background:C.bg,borderRadius:8,padding:3}}>
              {["3m","6m","12m"].map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  style={{
                    padding:"4px 9px",borderRadius:6,border:"none",cursor:"pointer",
                    background: chartPeriod === p ? C.white : "transparent",
                    color:      chartPeriod === p ? C.coral : C.mid,
                    fontSize:10,fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif",
                    boxShadow: chartPeriod === p ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  }}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div style={{
            display:"flex",alignItems:"flex-end",justifyContent:"space-between",
            gap:4,height:120,padding:"6px 0 4px",
          }}>
            {monthlyChart.map((m, i) => {
              const heightPct = (m.value / chartMax) * 100;
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,height:"100%"}}>
                  {/* Value tooltip */}
                  <div style={{
                    fontSize:9,fontWeight:700,color: m.isCurrent ? C.coral : C.light,
                    fontFamily:"'DM Sans',sans-serif",
                    height:12,whiteSpace:"nowrap",
                  }}>
                    {Math.round(m.value/1000)}k
                  </div>
                  {/* Bar */}
                  <div style={{
                    width:"100%",maxWidth:24,height:`${heightPct}%`,minHeight:4,
                    borderRadius:"6px 6px 2px 2px",
                    background: m.isCurrent
                      ? `linear-gradient(180deg, ${C.coral} 0%, #FF8082 100%)`
                      : `linear-gradient(180deg, #FFB5B7 0%, #FFD6D7 100%)`,
                    transition:"height .35s ease",
                  }}/>
                </div>
              );
            })}
          </div>
          {/* Labels */}
          <div style={{display:"flex",justifyContent:"space-between",gap:4,marginTop:6}}>
            {monthlyChart.map((m, i) => (
              <div key={i} style={{
                flex:1,textAlign:"center",
                fontSize:10,fontWeight:m.isCurrent?700:500,
                color: m.isCurrent ? C.coral : C.light,
                fontFamily:"'DM Sans',sans-serif",
              }}>{m.label}</div>
            ))}
          </div>

          {/* Legend */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:10,height:10,borderRadius:3,background:C.coral}}/>
              <span style={{fontSize:10,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>Mois en cours</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:10,height:10,borderRadius:3,background:"#FFD6D7"}}/>
              <span style={{fontSize:10,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>Historique</span>
            </div>
          </div>
        </div>

        {/* Add new listing — direct entry for property OR vehicle */}
        <div style={{padding:"0 16px",marginBottom:14}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>✨</span> Publier une nouvelle annonce
          </p>
          <div style={{display:"flex",gap:10}}>
            <button
              onClick={()=>onAddListing?.("property")}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:`linear-gradient(135deg, ${C.coral} 0%, #FF8082 100%)`,border:"none",borderRadius:16,padding:"14px 12px",cursor:"pointer",boxShadow:"0 3px 10px rgba(255,90,95,.25)"}}
            >
              <span style={{fontSize:24}}>🏠</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:13,fontWeight:700,color:"white"}}>Logement</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.85)",marginTop:1}}>Hôtel, villa, appart…</p>
              </div>
            </button>
            <button
              onClick={()=>onAddListing?.("vehicle")}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:`linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)`,border:"none",borderRadius:16,padding:"14px 12px",cursor:"pointer",boxShadow:"0 3px 10px rgba(37,99,235,.25)"}}
            >
              <span style={{fontSize:24}}>🚗</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:13,fontWeight:700,color:"white"}}>Véhicule</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.85)",marginTop:1}}>Voiture, 4×4, premium…</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:14,overflowX:"auto"}}>
          <button onClick={onManageTechs} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🔧</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:"#1D4ED8",textAlign:"left"}}>Techniciens</p>
              <p style={{fontSize:10,color:"#60A5FA",textAlign:"left"}}>Gérer l'équipe</p>
            </div>
          </button>
          <button onClick={onManagePros} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#FAF5FF",border:"1.5px solid #E9D5FF",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🛎️</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:"#7E22CE",textAlign:"left"}}>Mes Pros</p>
              <p style={{fontSize:10,color:"#A855F7",textAlign:"left"}}>Concierges · Agents</p>
            </div>
          </button>
          <button onClick={onBoost} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#FFF5F5",border:"1.5px solid #FFD6D7",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🚀</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.coral,textAlign:"left"}}>Boost</p>
              <p style={{fontSize:10,color:"#FCA5A5",textAlign:"left"}}>Mettre en avant</p>
            </div>
          </button>
        </div>

        {/* Category slides — horizontal per type */}
        {Object.entries(typeGroups).map(([type, buildings]) => (
          <div key={type} style={{marginBottom:20}}>
            {/* Section header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Icon name={typeIcons[type]||"home"} size={18} color={C.coral} stroke={1.8}/>
                <p style={{fontSize:15,fontWeight:700,color:C.black}}>{typeLabels[type]||type}</p>
                <span style={{fontSize:11,fontWeight:600,color:C.light,background:C.bg,padding:"2px 8px",borderRadius:10}}>{buildings.length}</span>
              </div>
              {buildings.length>2 && (
                <button style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:C.coral,cursor:"pointer"}}>
                  Voir tout →
                </button>
              )}
            </div>

            {/* Horizontal scroll of building cards */}
            <div style={{display:"flex",gap:12,padding:"0 16px",overflowX:"auto"}}>
              {buildings.map(building => {
                const availInB = building.units.filter(u=>u.available).length;
                const totalInB = building.units.length;
                const delegatedIds = delegationsMap[building.id] || [];
                const delegatedPros = delegatedIds
                  .map(id => userProfiles.allPros().find(p=>p.id===id))
                  .filter(Boolean);
                const delegationLabel = building.type === "hotel" || building.type === "motel"
                  ? "Concierge"
                  : "Agent";
                return (
                  <div key={building.id}
                    style={{flexShrink:0,width:260,background:C.white,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}
                  >
                    {/* Image */}
                    <div style={{position:"relative",height:120,overflow:"hidden",cursor:"pointer"}} onClick={()=>onViewBuilding?.(building)}>
                      <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 50%)"}}/>
                      <div style={{position:"absolute",bottom:8,left:10,right:10,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                        <p style={{fontSize:13,fontWeight:700,color:"white"}}>{building.name}</p>
                        <span style={{fontSize:10,fontWeight:700,color:availInB>0?"#4ADE80":"#FCA5A5",background:"rgba(0,0,0,.4)",padding:"3px 8px",borderRadius:10}}>
                          {availInB}/{totalInB}
                        </span>
                      </div>
                      {/* Badge délégation */}
                      {delegatedPros.length > 0 && (
                        <div style={{position:"absolute",top:8,left:8,background:"rgba(126,34,206,.95)",borderRadius:8,padding:"3px 8px",display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:10}}>🛎️</span>
                          <span style={{fontSize:10,fontWeight:700,color:"white"}}>{delegatedPros.length} {delegationLabel.toLowerCase()}{delegatedPros.length>1?"s":""}</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{padding:"10px 12px",cursor:"pointer"}} onClick={()=>onViewBuilding?.(building)}>
                      <p style={{fontSize:11,color:C.light,display:"flex",alignItems:"center",gap:4}}>
                        <ByerPin size={11}/> {building.address}
                      </p>
                      <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                        {building.units.slice(0,3).map(u=>(
                          <span key={u.id} style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:u.available?"#F0FDF4":"#FEF2F2",color:u.available?"#16A34A":"#EF4444"}}>
                            {u.label.split("·")[0].trim()}
                          </span>
                        ))}
                        {building.units.length>3 && (
                          <span style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:C.bg,color:C.mid}}>+{building.units.length-3}</span>
                        )}
                      </div>
                    </div>
                    {/* Delegation footer */}
                    <div style={{padding:"6px 10px 10px",borderTop:`1px solid ${C.border}`,marginTop:4}}>
                      {delegatedPros.length > 0 ? (
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{display:"flex",marginRight:-4}}>
                            {delegatedPros.slice(0,3).map((p,idx) => (
                              <div key={p.id} style={{marginLeft:idx===0?0:-8,border:"2px solid white",borderRadius:"50%"}}>
                                <FaceAvatar photo={p.photo} avatar={p.name[0]} bg="#7E22CE" size={22} radius={11}/>
                              </div>
                            ))}
                          </div>
                          <button onClick={(e)=>{e.stopPropagation(); setDelegationFor(building);}}
                            style={{flex:1,background:"none",border:"none",color:"#7E22CE",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
                            Gérer la délégation →
                          </button>
                        </div>
                      ) : (
                        <button onClick={(e)=>{e.stopPropagation(); setDelegationFor(building);}}
                          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"#FAF5FF",border:"1px dashed #C4B5FD",borderRadius:9,padding:"7px",cursor:"pointer",color:"#7E22CE",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                          <span style={{fontSize:13}}>🛎️</span>
                          <span>Confier à un {delegationLabel.toLowerCase()}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ─── Mes Véhicules — section dédiée ───────────────
            Affiche les véhicules détenus par le bailleur, séparés des
            biens immobiliers. Filtré par ville comme le reste. */}
        {filteredVehicles.length > 0 && (
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>🚗</span>
                <p style={{fontSize:15,fontWeight:700,color:C.black}}>Mes Véhicules</p>
                <span style={{fontSize:11,fontWeight:600,color:C.light,background:C.bg,padding:"2px 8px",borderRadius:10}}>{filteredVehicles.length}</span>
              </div>
              <button
                onClick={()=>onAddListing?.("vehicle")}
                style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:"#2563EB",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}
              >
                + Ajouter
              </button>
            </div>

            {/* Horizontal scroll de cartes véhicules */}
            <div style={{display:"flex",gap:12,padding:"0 16px",overflowX:"auto"}}>
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.id}
                  style={{flexShrink:0,width:240,background:C.white,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}
                >
                  {/* Image + status badge */}
                  <div style={{position:"relative",height:120,overflow:"hidden"}}>
                    <img src={vehicle.img} alt={vehicle.brand} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 50%)"}}/>
                    <span style={{
                      position:"absolute",top:8,right:8,
                      fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,
                      background: vehicle.available ? "rgba(22,163,74,.95)" : "rgba(239,68,68,.95)",
                      color:"white",
                    }}>
                      {vehicle.available ? "Disponible" : "Loué"}
                    </span>
                    <div style={{position:"absolute",bottom:8,left:10,right:10}}>
                      <p style={{fontSize:13,fontWeight:700,color:"white"}}>{vehicle.brand} {vehicle.model}</p>
                      <p style={{fontSize:10,color:"rgba(255,255,255,.85)",marginTop:1}}>{vehicle.year} · {vehicle.plate}</p>
                    </div>
                  </div>
                  {/* Info row */}
                  <div style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <p style={{fontSize:11,color:C.light,display:"flex",alignItems:"center",gap:4}}>
                        <ByerPin size={11}/> {vehicle.city}
                      </p>
                      <p style={{fontSize:13,fontWeight:700,color:C.black}}>
                        {fmt(vehicle.nightPrice)} <span style={{fontSize:10,fontWeight:500,color:C.light}}>F/j</span>
                      </p>
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:C.bg,color:C.mid}}>
                        {vehicle.fuel}
                      </span>
                      <span style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:C.bg,color:C.mid}}>
                        {vehicle.trans}
                      </span>
                      <span style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:C.bg,color:C.mid}}>
                        {vehicle.seats} pl.
                      </span>
                    </div>
                    {!vehicle.available && vehicle.availableFrom && (
                      <p style={{fontSize:10,color:C.coral,marginTop:6,fontWeight:600}}>
                        Libre le {vehicle.availableFrom}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occupancy summary */}
        <div style={{margin:"0 16px 24px",background:C.white,borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:12}}>Taux d'occupation</p>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1,height:8,borderRadius:4,background:C.border,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:4,width:`${occupancyPct}%`,background:occupancyPct>=70?"#16A34A":occupancyPct>=40?"#F59E0B":"#EF4444",transition:"width .4s ease"}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:C.black}}>{occupancyPct}%</span>
          </div>
          <div style={{display:"flex",gap:16,marginTop:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:4,background:"#16A34A"}}/>
              <span style={{fontSize:11,color:C.mid}}>{availUnits} disponibles</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:4,background:C.coral}}/>
              <span style={{fontSize:11,color:C.mid}}>{occupiedUnits} occupés</span>
            </div>
          </div>
        </div>

        <div style={{height:100}}/>
      </div>

      {/* Delegation sheet */}
      {delegationFor && (
        <DelegationSheet
          building={delegationFor}
          delegatedIds={delegationsMap[delegationFor.id] || []}
          onAdd={(proId) => { delegations.add(delegationFor.id, proId); refreshDelegations(); }}
          onRemove={(proId) => { delegations.remove(delegationFor.id, proId); refreshDelegations(); }}
          onClose={() => setDelegationFor(null)}
        />
      )}
    </div>
  );
}

/* ─── DELEGATION SHEET ─────────────────────────────
   Permet au bailleur de confier un building à un ou plusieurs
   concierges/agents. Many-to-many : un building peut être géré par
   plusieurs pros, et un pro peut gérer plusieurs buildings.
─────────────────────────────────────────────────── */
function DelegationSheet({ building, delegatedIds, onAdd, onRemove, onClose }) {
  const [tab, setTab] = useState("delegated"); // delegated | available
  const [search, setSearch] = useState("");

  /* Catégorie attendue : conciergerie pour hôtel/motel, agent_immo pour immeuble/villa */
  const expectedCat = (building.type === "hotel" || building.type === "motel") ? "conciergerie" : "agent_immo";
  const expectedLabel = expectedCat === "conciergerie" ? "Concierges" : "Agents immobiliers";

  const allPros = userProfiles.allPros();
  const delegatedPros = delegatedIds.map(id => allPros.find(p=>p.id===id)).filter(Boolean);
  const availablePros = allPros.filter(p =>
    !delegatedIds.includes(p.id) &&
    p.available &&
    /* Privilégier la catégorie attendue mais autoriser gestion_loc aussi */
    (p.category === expectedCat || p.category === "gestion_loc")
  );

  const q = search.trim().toLowerCase();
  const filtered = (tab === "delegated" ? delegatedPros : availablePros)
    .filter(p => !q || p.name.toLowerCase().includes(q) || (p.company||"").toLowerCase().includes(q));

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"92vh",display:"flex",flexDirection:"column"}} className="sheet">
        <div style={S.sheetHandle}/>

        {/* Header */}
        <div style={{padding:"4px 20px 12px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <p style={{fontSize:17,fontWeight:700,color:C.black}}>Délégation de gestion</p>
            <button style={S.sheetClose} onClick={onClose}>
              <Icon name="close" size={18} color={C.mid}/>
            </button>
          </div>
          <p style={{fontSize:12,color:C.mid,lineHeight:1.5}}>
            <strong>{building.name}</strong> · {building.address}
          </p>
        </div>

        {/* Info bar */}
        <div style={{margin:"0 20px 12px",background:"#FAF5FF",border:"1px solid #E9D5FF",borderRadius:12,padding:"10px 12px"}}>
          <p style={{fontSize:12,color:"#6B21A8",lineHeight:1.5}}>
            🛎️ Confiez la gestion à un <strong>{expectedCat==="conciergerie" ? "concierge" : "agent immobilier"}</strong>. Plusieurs pros peuvent gérer la même entité — la commission est négociée individuellement.
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:10}}>
          <button onClick={()=>setTab("delegated")}
            style={{flex:1,padding:"9px 10px",borderRadius:10,border:"none",cursor:"pointer",
              background: tab==="delegated" ? "#7E22CE" : C.bg,
              color: tab==="delegated" ? "white" : C.mid,
              fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            }}>
            Délégués ({delegatedPros.length})
          </button>
          <button onClick={()=>setTab("available")}
            style={{flex:1,padding:"9px 10px",borderRadius:10,border:"none",cursor:"pointer",
              background: tab==="available" ? "#7E22CE" : C.bg,
              color: tab==="available" ? "white" : C.mid,
              fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            }}>
            Disponibles ({availablePros.length})
          </button>
        </div>

        {/* Search */}
        <div style={{padding:"0 20px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px"}}>
            <svg width="14" height="14" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Rechercher un nom, une société…"
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:12,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}/>
          </div>
        </div>

        {/* List */}
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          {filtered.length === 0 ? (
            <div style={{padding:"24px 12px",textAlign:"center"}}>
              <p style={{fontSize:13,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>
                {tab === "delegated"
                  ? "Aucun pro ne gère encore cette entité."
                  : "Aucun pro disponible. Recrutez d'abord depuis la liste des pros."}
              </p>
            </div>
          ) : filtered.map(pro => {
            const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
            const isDelegated = delegatedIds.includes(pro.id);
            return (
              <div key={pro.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||"#7E22CE"} size={42} radius={21}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{pro.name}</p>
                    {pro.verified && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                  </div>
                  {pro.company && <p style={{fontSize:11,color:C.mid,marginTop:1}}>{pro.company}</p>}
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                    <span style={{fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:6,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
                      {cat?.icon} {cat?.label}
                    </span>
                    {pro.commission && (
                      <span style={{fontSize:10,color:C.coral,fontWeight:600}}>{pro.commission}</span>
                    )}
                  </div>
                </div>
                {isDelegated ? (
                  <button onClick={()=>onRemove(pro.id)} title="Reprendre la gestion de cette entité"
                    style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",color:C.dark,fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                    Reprendre
                  </button>
                ) : (
                  <button onClick={()=>onAdd(pro.id)}
                    style={{background:"#7E22CE",border:"none",borderRadius:8,padding:"7px 12px",cursor:"pointer",color:"white",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                    + Confier
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── BUILDING DETAIL SCREEN (Entité Mère → Filles) ── */
function BuildingDetailScreen({ building, onBack }) {
  const [expandedFloor, setExpandedFloor] = useState(null);

  if (!building) return null;

  const availCount = building.units.filter(u=>u.available).length;
  const totalCount = building.units.length;

  /* Group units by floor */
  const floors = {};
  building.units.forEach(u => {
    const f = u.floor || "RDC";
    if (!floors[f]) floors[f] = [];
    floors[f].push(u);
  });

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Hero image */}
        <div style={{position:"relative",height:200,overflow:"hidden"}}>
          <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 40%)"}}/>
          <button style={{...S.dBack,background:"rgba(0,0,0,.35)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:14,left:16,right:16}}>
            <p style={{fontSize:18,fontWeight:800,color:"white"}}>{building.name}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,.8)",marginTop:2}}>
              <span>{building.address}</span>
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{display:"flex",background:C.white,padding:"12px 16px",gap:0,borderBottom:`1px solid ${C.border}`}}>
          {[
            {val:totalCount, label:"Unités"},
            {val:availCount, label:"Disponibles", color:"#16A34A"},
            {val:totalCount-availCount, label:"Réservés", color:C.coral},
            {val:building.floors, label:"Étages"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
              <span style={{fontSize:16,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
              <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Units by floor */}
        <div style={{padding:"16px"}}>
          <p style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:12}}>Unités par étage</p>

          {Object.entries(floors).map(([floor, units]) => {
            const isOpen = expandedFloor === floor;
            const floorAvail = units.filter(u=>u.available).length;
            return (
              <div key={floor} style={{background:C.white,borderRadius:14,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
                {/* Floor header */}
                <button
                  onClick={()=>setExpandedFloor(isOpen?null:floor)}
                  style={{display:"flex",alignItems:"center",width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",gap:10}}
                >
                  <div style={{width:36,height:36,borderRadius:10,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:14,fontWeight:800,color:C.dark}}>{floor.replace("ème","").replace("er","").replace("Entier","E")}</span>
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{floor}</p>
                    <p style={{fontSize:11,color:C.light}}>{units.length} unité{units.length>1?"s":""} · {floorAvail} dispo</p>
                  </div>
                  <svg width="14" height="14" fill="none" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Units list */}
                {isOpen && units.map((unit,ui) => (
                  <div key={unit.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
                    <div style={{width:10,height:10,borderRadius:5,flexShrink:0,background:unit.available?"#16A34A":C.light,...(unit.available?{boxShadow:"0 0 0 3px #16A34A22"}:{})}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <p style={{fontSize:13,fontWeight:600,color:C.black}}>{unit.label}</p>
                        {unit.count && <span style={{fontSize:10,color:C.mid,background:C.bg,padding:"1px 6px",borderRadius:8}}>x{unit.count}</span>}
                      </div>
                      <p style={{fontSize:11,color:C.light,marginTop:1}}>
                        {unit.propType}
                        {!unit.available && unit.availableFrom && ` · Libre le ${unit.availableFrom}`}
                      </p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {unit.available ? (
                        <>
                          <p style={{fontSize:13,fontWeight:700,color:C.black}}>{fmt(unit.nightPrice)}</p>
                          <p style={{fontSize:10,color:C.light}}>/nuit</p>
                        </>
                      ) : (
                        <span style={{fontSize:10,fontWeight:600,color:C.light,background:C.bg,padding:"3px 8px",borderRadius:10}}>Réservé</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{height:60}}/>
      </div>
    </div>
  );
}
