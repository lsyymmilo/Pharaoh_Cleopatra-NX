import importlib.util, sys
spec = importlib.util.spec_from_file_location('mc', r'pharaoh-switch\switch_port\make_chinese.py')
mc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mc)
recs = mc.parse_mm_file(r'D:\Games\Pharaoh Gold\Pharaoh_MM.cht')
r = recs[1]
print('rec1 title:', repr(r['title'][:40]))
print('rec1 content:', repr(r['content'][:80]))
print('rec0 title:', repr(recs[0]['title'][:40]))
print('rec0 content:', repr(recs[0]['content'][:60]))
