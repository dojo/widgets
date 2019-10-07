import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

export default function() {
    const files = glob.sync(path.join(__dirname, 'widgets/**/*'), { nodir: true }) as any;
    const prefix = path.join(__dirname, 'widgets');

    let results: any[] = [];
    for (let i = 0; i < files.length; i++) {
        results.push({
            path: files[i].replace(prefix, ''),
            content: fs.readFileSync(files[i], 'utf8')
        })
    }
    return results;
}