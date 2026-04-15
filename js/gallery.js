/* Byer — Gallery Screen */

function GalleryScreen({ item, startIdx, onBack, onOpenDetail }) {
  const [idx, setIdx] = useState(startIdx);
  const gallery = GALLERY[item.id];
  const imgs    = gallery.imgs;
  const labels  = gallery.labels;

  return (
    <div style={S.galRoot}>
      <style>{BYER_CSS}</style>
      <div style={S.galHeader}>
        <button style={S.galBack} onClick={onBack}><Icon name="close" size={20} color={C.dark} stroke={2}/></button>
        <div style={{textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black}}>{item.title}</p>
          <p style={{fontSize:12,color:C.mid}}>{idx+1} / {imgs.length}</p>
        </div>
        <button style={S.galDetailBtn} onClick={onOpenDetail}>Détails</button>
      </div>
      <div style={S.galMain}>
        <img src={imgs[idx]} alt={labels[idx]} style={S.galImg} className="galimg"/>
        <div style={S.galLabel}>{labels[idx]}</div>
        {idx>0 && <button style={{...S.galArrow,left:14}} onClick={()=>setIdx(i=>i-1)}><svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>}
        {idx<imgs.length-1 && <button style={{...S.galArrow,right:14}} onClick={()=>setIdx(i=>i+1)}><svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>}
      </div>
      <div style={S.thumbStrip}>
        {imgs.map((img,i)=>(
          <button key={i} style={{...S.thumb,...(i===idx?S.thumbOn:{})}} onClick={()=>setIdx(i)}>
            <img src={img} alt={labels[i]} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {i===idx && <div style={S.thumbActiveOverlay}/>}
          </button>
        ))}
      </div>
      <div style={S.labelsStrip}>
        {labels.map((l,i)=>(
          <button key={i} style={{...S.labelChip,...(i===idx?S.labelChipOn:{})}} onClick={()=>setIdx(i)}>{l}</button>
        ))}
      </div>
    </div>
  );
}
