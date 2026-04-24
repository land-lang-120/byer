function BookingScreen({ item, duration, onBack, onComplete, onCreateBooking }) {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [departDate, setDepartDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState('');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getNights = () => {
    const arrival = new Date(arrivalDate);
    const depart = new Date(departDate);
    const nights = Math.max(1, Math.ceil((depart - arrival) / (1000 * 60 * 60 * 24)));
    return nights;
  };

  const calculatePrice = () => {
    const isVehicle = item?.type === "vehicle";
    const dayBase  = item?.nightPrice || 25000;          // base journalière commune
    const monthP   = item?.monthPrice || null;
    let breakdown = {};

    if (duration === 'month' && (monthP || isVehicle)) {
      // Mensuel — property : monthPrice direct ; vehicle : day*22
      const baseMonth = monthP || Math.round(dayBase * 22);
      breakdown.base    = baseMonth;
      breakdown.label   = `${fmt(baseMonth)} × 1 mois`;
      breakdown.dossier = Math.round(baseMonth * 0.05);
      breakdown.caution = baseMonth;
      breakdown.total   = baseMonth + breakdown.dossier + breakdown.caution;
    } else if (duration === 'week' && isVehicle) {
      const baseWeek = Math.round(dayBase * 6);
      breakdown.base    = baseWeek;
      breakdown.label   = `${fmt(baseWeek)} × 1 semaine`;
      breakdown.service = Math.round(baseWeek * 0.10);
      breakdown.caution = 50000;
      breakdown.total   = baseWeek + breakdown.service + breakdown.caution;
    } else if (duration === 'day' && isVehicle) {
      const days = getNights(); // ré-utilise calc d'écart en jours
      breakdown.base    = dayBase * days;
      breakdown.label   = `${fmt(dayBase)} × ${days} jour${days>1?'s':''}`;
      breakdown.service = Math.round(breakdown.base * 0.12);
      breakdown.caution = 50000;
      breakdown.total   = breakdown.base + breakdown.service + breakdown.caution;
    } else {
      // night (property) — fallback historique
      const nights = getNights();
      breakdown.base    = dayBase * nights;
      breakdown.label   = `${fmt(dayBase)} × ${nights} nuit${nights > 1 ? 's' : ''}`;
      breakdown.service = Math.round(breakdown.base * 0.12);
      breakdown.taxes   = Math.round(breakdown.base * 0.05);
      breakdown.total   = breakdown.base + breakdown.service + breakdown.taxes;
    }

    return breakdown;
  };

  const pricing = calculatePrice();
  const canContinueStep1 = arrivalDate && departDate && arrivalDate < departDate;
  const canConfirmPayment = termsAccepted && (
    paymentMethod === 'eu' ||
    paymentMethod === 'virement' ||
    (paymentMethod && phone)
  );

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleConfirmPayment = async () => {
    setBookingError("");
    setBookingLoading(true);

    const ref = 'BYR-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    setConfirmationRef(ref);

    // ─── INSERT dans Supabase si l'annonce vient de la BDD ───────
    // (item._supabase === true → listing réel avec owner_id)
    const db = window.byer && window.byer.db;
    if (db && db.isReady && item && item._supabase && item.ownerId) {
      try {
        const { data: sess } = await db.auth.getSession();
        const user = sess && sess.session && sess.session.user;
        if (user) {
          const paymentMap = {
            mtn:      "momo",
            om:       "om",
            orange:   "om",
            card:     "card",
            visa:     "card",
            virement: "card",
            eu:       "card",
          };
          const { error: bookErr } = await db.bookings.create({
            guest_id:       user.id,
            host_id:        item.ownerId,
            listing_id:     item.id,
            checkin:        arrivalDate,
            checkout:       departDate,
            guests_count:   guests,
            total_price:    pricing.total,
            payment_method: paymentMap[paymentMethod] || "momo",
            payment_status: "paid",
            status:         "confirmed",
          });
          if (bookErr) {
            console.warn("[byer] booking insert error:", bookErr.message);
            // On n'interrompt PAS le flow : la résa locale fonctionne quand même
          }
        }
      } catch (e) {
        console.warn("[byer] booking error:", e);
      }
    }
    setBookingLoading(false);

    // Construire un booking persistable + l'ajouter à la liste utilisateur
    if (onCreateBooking && item) {
      const isVehicle = item.type === "vehicle";
      const nights = getNights();
      const heroImg = (typeof GALLERY !== "undefined" && GALLERY[item.id]?.imgs?.[0])
        || item.img
        || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400";
      const coords = (typeof CITY_COORDS !== "undefined" && CITY_COORDS[item.city]) || { lat: 4.05, lng: 9.7 };

      const booking = {
        id: ref,
        ref,
        title: item.title || "Réservation",
        type: isVehicle ? "vehicle" : "property",
        city: item.city || "—",
        zone: item.zone || item.city || "—",
        address: `${item.zone || ""} ${item.city || ""}`.trim() || "Cameroun",
        lat: coords.lat,
        lng: coords.lon || coords.lng,
        img: heroImg,
        host: item.host || "Hôte Byer",
        hostPhoto: item.hostPhoto || null,
        checkIn: formatDate(arrivalDate),
        checkOut: formatDate(departDate),
        nights,
        price: pricing.base ? Math.round(pricing.base / Math.max(1, nights)) : (item.nightPrice || 0),
        amenities: (item.amenities || []).slice(0, 3),
        status: "upcoming",
        createdAt: Date.now(),
      };
      onCreateBooking(booking);
    }

    setStep(3);
  };

  const handleReturnHome = () => {
    onBack?.();
  };

  const handleViewTrips = () => {
    // Navigation to trips would be handled by parent
    onComplete?.();
  };

  const StepIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 32,
      paddingTop: 16
    }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: s <= step ? C.coral : 'transparent',
            border: s <= step ? 'none' : `2px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: s <= step ? C.white : C.light,
            transition: 'all 0.3s'
          }}>
            {s}
          </div>
          {s < 3 && (
            <div style={{
              width: 8,
              height: 2,
              backgroundColor: s < step ? C.coral : C.border,
              transition: 'all 0.3s'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Récapitulatif
  if (step === 1) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: C.dark }}>Retour</span>
        </div>

        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {/* Property Card */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            alignItems: 'flex-start'
          }}>
            <img
              src={(GALLERY[item?.id]?.imgs?.[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                objectFit: 'cover',
                flexShrink: 0
              }}
              alt={item?.name}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.dark,
                marginBottom: 4
              }}>
                {item?.title || 'Propriété'}
              </div>
              <div style={{
                fontSize: 13,
                color: C.light,
                marginBottom: 8
              }}>
                {(item?.zone ? item.zone + ', ' + item.city : 'Localisation')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.coral
              }}>
                {(() => {
                  if (!item) return `${fmt(25000)}/nuit`;
                  const { price, unit } = priceFor(item, duration);
                  return `${fmt(price)}${unit}`;
                })()}
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Arrivée
            </div>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 16,
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Départ
            </div>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Guests Selection */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Nombre de voyageurs
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  backgroundColor: C.white,
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.dark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                −
              </button>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.dark,
                minWidth: 30,
                textAlign: 'center'
              }}>
                {guests}
              </div>
              <button
                onClick={() => setGuests(Math.min(10, guests + 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  backgroundColor: C.white,
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.dark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Détails du prix
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: 13,
              color: C.dark
            }}>
              <span>{pricing.label}</span>
              <span>{fmt(pricing.base)}</span>
            </div>
            {/* Lignes dynamiques basées sur la breakdown calculée */}
            {(() => {
              const lines = [];
              if (pricing.service != null) lines.push({l:`Frais de service (${duration==='week'?'10':'12'}%)`, v:pricing.service});
              if (pricing.dossier != null) lines.push({l:"Frais de dossier (5%)", v:pricing.dossier});
              if (pricing.taxes   != null) lines.push({l:"Taxes (5%)",            v:pricing.taxes});
              if (pricing.caution != null) lines.push({l:item?.type==='vehicle'?"Caution véhicule":"Caution", v:pricing.caution});
              return lines.map((row, i) => (
                <div key={row.l} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: i === lines.length - 1 ? 16 : 10,
                  fontSize: 13,
                  color: C.light,
                  paddingBottom: i === lines.length - 1 ? 16 : 0,
                  borderBottom: i === lines.length - 1 ? `1.5px solid ${C.border}` : 'none',
                }}>
                  <span>{row.l}</span>
                  <span>{fmt(row.v)}</span>
                </div>
              ));
            })()}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              fontWeight: 700,
              color: C.dark
            }}>
              <span>Total</span>
              <span>{fmt(pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setStep(2)}
          disabled={!canContinueStep1}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: canContinueStep1 ? C.coral : C.border,
            color: C.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: canContinueStep1 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            opacity: canContinueStep1 ? 1 : 0.6
          }}
        >
          Continuer
        </button>
      </div>
    );
  }

  // Step 2: Paiement
  if (step === 2) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => setStep(1)}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: C.dark }}>Retour</span>
        </div>

        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 20
          }}>
            Mode de paiement
          </div>

          {/* Payment Method Cards */}
          <div style={{ marginBottom: 24 }}>
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: C.white,
                  borderRadius: 14,
                  border: `2px solid ${paymentMethod === method.id ? C.coral : C.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 4,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: method.accent,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.dark
                  }}>
                    {method.label}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: C.light,
                    marginTop: 2
                  }}>
                    {method.short}
                  </div>
                </div>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${paymentMethod === method.id ? C.coral : C.border}`,
                  backgroundColor: paymentMethod === method.id ? C.coral : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {paymentMethod === method.id && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: C.white
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Phone Input for MoMo/OM */}
          {(paymentMethod === 'mtn' || paymentMethod === 'orange') && (
            <div style={{
              backgroundColor: C.bg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 12
              }}>
                Numéro de téléphone
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* EU Agence Info */}
          {paymentMethod === 'eu' && (
            <div style={{
              backgroundColor: '#E3F2FD',
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              borderLeft: `4px solid #1B4D89`
            }}>
              <div style={{
                fontSize: 13,
                color: '#1B4D89',
                fontWeight: 500
              }}>
                Rendez-vous en agence Express Union pour finaliser votre paiement
              </div>
            </div>
          )}

          {/* Virement Info */}
          {paymentMethod === 'virement' && (
            <div style={{
              backgroundColor: C.bg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 12
              }}>
                Détails de virement
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 13,
                color: C.dark
              }}>
                <div>
                  <span style={{ color: C.light }}>IBAN: </span>
                  <span style={{ fontWeight: 600 }}>CM21 30070 00000 00001234567890</span>
                </div>
                <div>
                  <span style={{ color: C.light }}>BIC: </span>
                  <span style={{ fontWeight: 600 }}>BYERCMCX</span>
                </div>
              </div>
            </div>
          )}

          {/* Terms Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            padding: 12,
            backgroundColor: C.bg,
            borderRadius: 12
          }}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0
              }}
            />
            <label style={{
              fontSize: 12,
              color: C.dark,
              cursor: 'pointer',
              lineHeight: 1.5
            }}>
              J'accepte les conditions générales de Byer
            </label>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={!canConfirmPayment}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: canConfirmPayment ? C.coral : C.border,
            color: C.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: canConfirmPayment ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            opacity: canConfirmPayment ? 1 : 0.6
          }}
        >
          Confirmer et payer
        </button>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Checkmark Animation */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'scaleIn 0.5s ease-out',
            marginTop: 20
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37 14L16.5 34.5L7 25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Title */}
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Réservation confirmée !
          </div>

          {/* Booking Ref */}
          <div style={{
            fontSize: 14,
            color: C.light,
            marginBottom: 24,
            textAlign: 'center'
          }}>
            Référence: <span style={{ fontWeight: 700, color: C.dark }}>{confirmationRef}</span>
          </div>

          {/* Summary Card */}
          <div style={{
            width: '100%',
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 16,
              alignItems: 'flex-start'
            }}>
              <img
                src={(GALLERY[item?.id]?.imgs?.[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  objectFit: 'cover',
                  flexShrink: 0
                }}
                alt={item?.name}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.dark,
                  marginBottom: 4
                }}>
                  {item?.title || 'Propriété'}
                </div>
                <div style={{
                  fontSize: 12,
                  color: C.light
                }}>
                  {formatDate(arrivalDate)} - {formatDate(departDate)}
                </div>
              </div>
            </div>
            <div style={{
              borderTop: `1.5px solid ${C.border}`,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              fontWeight: 600,
              color: C.dark
            }}>
              <span>Montant payé</span>
              <span>{fmt(calculatePrice().total)}</span>
            </div>
            <div style={{
              marginTop: 12,
              fontSize: 12,
              color: C.light
            }}>
              Mode: {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'N/A'}
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div style={{
            width: 120,
            height: 120,
            backgroundColor: C.bg,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              {[...Array(10)].map((_, i) => (
                [...Array(10)].map((_, j) => (
                  <rect
                    key={`${i}-${j}`}
                    x={j * 10}
                    y={i * 10}
                    width="9"
                    height="9"
                    fill={Math.random() > 0.5 ? C.dark : 'transparent'}
                    stroke={C.border}
                    strokeWidth="0.5"
                  />
                ))
              ))}
            </svg>
          </div>
          <div style={{
            fontSize: 12,
            color: C.light,
            marginBottom: 20
          }}>
            Votre QR Code d'accès
          </div>

          {/* Info Box */}
          <div style={{
            width: '100%',
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            borderLeft: `4px solid #0EA5E9`,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 13,
              color: '#0284C7',
              fontWeight: 500
            }}>
              Le propriétaire a été notifié
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleViewTrips}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: `2px solid ${C.coral}`,
              backgroundColor: 'transparent',
              color: C.coral,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Voir mes voyages
          </button>
          <button
            onClick={handleReturnHome}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: C.coral,
              color: C.white,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Retour à l'accueil
          </button>
        </div>

        <style>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }
}
