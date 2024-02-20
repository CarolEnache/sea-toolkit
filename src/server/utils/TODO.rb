TOTAL
  OUTPUT
DOMESTIC
  OUTPUT
  VALUE_ADDED
  INCOME
  EMPLOYMENT
  TAXES

# TOTAL > OUTPUT
4   | Type II multiplier (incl. income)             | =SUM('OECD Type II'!C5:C40)
5   | Type I multiplier (simple, excl. income)      | =SUM('OECD Type I'!C5:C40)
6   | Initial or ("direct") effect                  | 1
7   | First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C92
8   | Industrial support effects                    | =C5-C7-C6
9   | Consumption induced (or "induced") effect     | =C4-C5
10  | Production induced (or "indirect") effect     | =C7+C8

# DOMESTIC > OUTPUT
15  | Type II multiplier (incl. income)             | =SUM('OECD Type II'!C47:C82)
16  | Type I multiplier (simple, excl. income)      | =SUM('OECD Type I'!C47:C82)
17  | Initial or ("direct") effect                  | 1
18  | First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C116
19  | Industrial support effects                    | =C16-C18-C17
Consumption induced (or "induced") effect     | =C15-C16
Production induced (or "indirect") effect     | =C18+C19
Outside of region                             | =C4-C15

# DOMESTIC > VALUE_ADDED
25  | Type II multiplier (incl. income)             | =MMULT('OECD Direct Requirements'!C95:AL95,'OECD Type II'!$C$47:$AL$82)
Type I multiplier (simple, excl. income)      | =MMULT('OECD Direct Requirements'!C95:AL95,'OECD Type I'!$C$47:$AL$82)
Initial or ("direct") effect                  | ='OECD Direct Requirements'!C95
First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C117
Industrial support effects                    | =C26-C27-C28
Consumption induced (or "induced") effect     | =C25-C26
Production induced (or "indirect") effect     | =C28+C29

# DOMESTIC > INCOME
34  | Type II multiplier (incl. income)             | =MMULT('OECD Direct Requirements'!C97:AL97,'OECD Type II'!$C$47:$AL$82)
Type I multiplier (simple, excl. income)      | =MMULT('OECD Direct Requirements'!C97:AL97,'OECD Type I'!$C$47:$AL$82)
Initial or ("direct") effect                  | ='OECD Direct Requirements'!C97
First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C118
Industrial support effects                    | 
Consumption induced (or "induced") effect     | 
Production induced (or "indirect") effect     | 

# DOMESTIC > EMPLOYMENT
43  | Type II multiplier (incl. income)             | =MMULT('OECD Direct Requirements'!C99:AL99,'OECD Type II'!$C$47:$AL$82)
Type I multiplier (simple, excl. income)      | =MMULT('OECD Direct Requirements'!C99:AL99,'OECD Type I'!$C$47:$AL$82)
Initial or ("direct") effect                  | ='OECD Direct Requirements'!C99
First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C119
Industrial support effects                    | 
Consumption induced (or "induced") effect     | 
Production induced (or "indirect") effect     | 

# DOMESTIC > TAXES
52  | Type II multiplier (incl. income)             | =MMULT('OECD Direct Requirements'!C107:AL107,'OECD Type II'!$C$47:$AL$82)
Type I multiplier (simple, excl. income)      | =MMULT('OECD Direct Requirements'!C107:AL107,'OECD Type I'!$C$47:$AL$82)
Initial or ("direct") effect                  | ='OECD Direct Requirements'!C107
First round (sometimes called direct) effect  | ='OECD Direct Requirements'!C120
Industrial support effects                    | 
Consumption induced (or "induced") effect     | 
Production induced (or "indirect") effect     | 
