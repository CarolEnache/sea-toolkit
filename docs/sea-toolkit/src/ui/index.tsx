import { Link as PdfLink, Page as PdfPage, Text as PdfText, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '64px 52px 64px 48px',
  },
  DocumentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '200px auto 10px',
    textAlign: 'center',
    maxWidth: '420px',
  },
  DocumentAuthors: {
    fontSize: 14,
    margin: '30px auto 0',
    textAlign: 'left',
    maxWidth: '350px',
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '200px 0 18px'
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '18px 0 9px',
  },
  h4: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '18px 0 9px',
  },
  h5: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '18px 0 9px',
  },
  h6: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    margin: '18px 0 9px',
  },
  paragraph: {
    fontSize: 12,
    margin: '0 auto 9px 0',
    maxWidth: '420px',
    lineHeight: 1.5,
  },
  BR: {
    width: '100%',
    height: '1px',
    margin: '-9px 0 0',
  },
  Concept: {
    fontSize: 12,
    padding: '0 18px 9px',
    margin: '0 auto 9px 0',
    width: '420px',
    lineHeight: 1.5,
    backgroundColor: '#e0e0ff',
    borderRadius: '8px',
  },
  Link: {
    color: '#000000',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  }
});

export const Page = (props) => <PdfPage size="A4" style={styles.page} {...props} />;
export const Text = (props) => <PdfText style={styles.paragraph} {...props} />;
export const BR = (props) => <View style={styles.BR} {...props} />;
export const DocumentTitle = (props) => <PdfText style={styles.DocumentTitle} {...props} />;
export const DocumentAuthors = (props) => <PdfText style={styles.DocumentAuthors} {...props} />;
export const H2 = (props) => <PdfText style={styles.h2} {...props} />;
export const H3 = (props) => <PdfText style={styles.h3} {...props} />;
export const H4 = (props) => <PdfText style={styles.h4} {...props} />;
export const H5 = (props) => <PdfText style={styles.h5} {...props} />;
export const H6 = (props) => <PdfText style={styles.h6} {...props} />;
export const Concept = (props) => <View style={styles.Concept} {...props} />;
export const Link = (props) => <PdfLink style={styles.Link} {...props} />;
